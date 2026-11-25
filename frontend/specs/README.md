# Contrato de datos — Dashboard financiero

**Estado:** contrato de datos para especificación; no implementa llamadas ni componentes.
**Verificación:** endpoints inspeccionados en FastAPI `/docs` (OpenAPI) y respuestas reales el 2026-11-25.
**Tipos relacionados:** [`api-types.ts`](./api-types.ts), [`param-types.ts`](./param-types.ts) y decisiones de UI en [`componentes.md`](./componentes.md).

## Convenciones

- Nombres de query y propiedades de respuesta conservan el contrato API en `snake_case`.
- Las fechas se transmiten como strings ISO `YYYY-MM-DD` (`format: date` en OpenAPI). Son inclusivas para los filtros.
- Las respuestas de listas son arrays JSON; una lista vacía es una respuesta válida y no equivale a un error.
- Los valores monetarios y ratios llegan como números JSON, no como strings formateados. La UI se encarga de moneda, porcentaje y mensajes en español.
- FastAPI ignora parámetros de query desconocidos; la UI debe usar exactamente los nombres aquí documentados.

---

## Funcionalidad 1 — Filtro de rango de fechas

### Endpoints consumidos

| Endpoint | Propósito | Respuesta TypeScript |
| --- | --- | --- |
| `GET /api/metrics/facets` | Obtener referencia global de fechas disponibles. No recibe parámetros de query y no refleja filtros activos. | `FacetsResponse` |
| `GET /api/metrics` | Obtener movimientos para calcular KPIs y gráficos del dashboard principal. | `FinancialMovement[]` de `src/lib/financial-types.ts` |

### Tipos de petición y respuesta

- Parámetros de `/api/metrics`: `DateRangeFilter` (`start_date?`, `end_date?`). Ambos son opcionales e independientes.
- Respuesta de `/api/metrics/facets`: `FacetsResponse`, con `operation_types`, `business_types`, `categories`, `min_date` y `max_date`.
- Respuesta de `/api/metrics`: array de `FinancialMovement`, con `create_date`, `amount`, `operation_type`, `category` y `business_type`.
- Los KPIs y gráficos no son respuestas directas de endpoints: se calculan en cliente a partir de los movimientos recibidos y filtrados.

### Valores válidos y restricciones

| Parámetro/campo | Restricción |
| --- | --- |
| `start_date` | Opcional; fecha ISO `YYYY-MM-DD`; límite inclusivo. |
| `end_date` | Opcional; fecha ISO `YYYY-MM-DD`; límite inclusivo. |
| Combinación del rango | Si ambas fechas existen, la UI exige `start_date <= end_date`. El backend no valida este orden y puede responder `200 []` para rango invertido. |
| Disponibilidad | `min_date` y `max_date` son dinámicos. La UI los presenta como referencia y valida que las selecciones estén dentro del rango global disponible. |
| `FacetsResponse.business_types` | Valores del enum: `B2B`, `B2C`. |
| `FacetsResponse.operation_types` | Valores del enum: `income`, `outcome`. |
| `FacetsResponse.categories` | Valores del enum: `suppliers`, `sales`, `operational`, `administrative`, `others`; lista global, no filtrada por negocio ni operación. |

### Casos límite y respuesta de UI

1. **Ambas fechas vacías:** omitir ambos parámetros; mostrar todos los datos disponibles devueltos por `/api/metrics`. Los KPIs y gráficos se calculan sobre esos mismos movimientos.
2. **Rango invertido o fecha fuera de `min_date`–`max_date`:** no enviar la consulta; mantener los datos previos identificados como correspondientes al filtro previo y mostrar error de validación en español junto al filtro. El backend no protege estos casos por sí mismo.

---

## Funcionalidad 2 — Alertas de anomalías

### Endpoint consumido

| Endpoint | Propósito | Respuesta TypeScript |
| --- | --- | --- |
| `GET /api/metrics/alerts` | Devolver períodos en los que `increase_ratio` supera estrictamente el umbral. | `AlertsResponse` (`AlertEntry[]`) |

### Tipo de petición y respuesta

- Query: `AlertsParams`, que extiende `DateRangeFilter` e incluye `threshold?`, `group_by?` y `business_type?`.
- Respuesta: array de `AlertEntry`: `period`, `outcome_total`, `baseline_average`, `increase_ratio`.
- `period` es un string. Con `group_by=month` (default), el formato es `YYYY-MM`; para día/semana el período refleja esa granularidad.
- `increase_ratio` es un ratio, no un porcentaje: para presentarlo en porcentaje, multiplicar por 100.

### Valores válidos y restricciones

| Parámetro | Valor válido / default / límite |
| --- | --- |
| `threshold` | Number; default `0.3`; FastAPI exige `>= 0` sin máximo. La regla de producto/UI es restringirlo a `[0.01, 1.0]` antes de enviar. |
| `group_by` | `day`, `week` o `month`; default `month`. |
| `start_date`, `end_date` | Opcionales; `YYYY-MM-DD`, inclusivos; debe validarse en cliente el orden y el rango disponible conforme a Funcionalidad 1. |
| `business_type` | Opcional; `B2B` o `B2C`. Para la tabla principal no se aplica segmentación y se omite. |
| Regla de alerta | Se genera alerta si `increase_ratio > threshold`; igualdad exacta no activa alerta. |
| `baseline_average` | Promedio acumulado de períodos previos del conjunto que queda tras el filtro; no es media móvil de tres períodos. |

### Casos límite y respuesta de UI

1. **No hay alertas (`[]`):** mantener el panel y sus encabezados; mostrar el estado vacío explícito “No se detectaron anomalías para este umbral y rango de fechas.” No ocultar la tabla/panel.
2. **Rango activo con uno o pocos períodos:** respetar la respuesta API y mostrar “Media histórica previa”; el baseline no incluye períodos anteriores al inicio del rango y el primer período no puede generar alerta. No presentarlo como una media móvil real ni inferir alertas ausentes.

---

## Funcionalidad 3 — Comparativa de ingresos B2B vs B2C

### Endpoints consumidos

| Endpoint | Parámetros para esta vista | Propósito | Respuesta TypeScript |
| --- | --- | --- | --- |
| `GET /api/metrics/facets` | Ninguno | Referencia global de fechas y presencia de tipos de negocio; no proporciona categorías por segmento. | `FacetsResponse` |
| `GET /api/metrics/categories/top` | Una consulta por `business_type=B2B` y otra por `business_type=B2C`; en ambas `operation_type=income`, `limit=5` y mismo rango. | Filas de categoría e ingresos para cada tabla. | `TopCategoriesResponse` (`CategoryEntry[]`) por negocio |
| `GET /api/metrics/summary` | Una consulta por negocio; `operation_type=income`, `business_type` correspondiente, mismo rango, `group_by=month`. | Ingreso completo por período para calcular denominador de porcentajes y total del gráfico. | `SummaryResponse` (`SummaryEntry[]`) por negocio |

### Tipos de petición y respuesta

- Query de tops: `TopsCategoriesParams` (`operation_type?`, `limit?`, `start_date?`, `end_date?`, `business_type?`).
- Query de resumen: `SummaryParams` (`group_by?`, `start_date?`, `end_date?`, `operation_type?`, `category?`, `business_type?`). Para esta vista se omite `category`.
- Tops devuelven `CategoryEntry[]`: `category`, `operation_type`, `total_amount`. No devuelven el porcentaje.
- Summary devuelve `SummaryEntry[]`: `period`, `income`, `outcome`, `net`. El total de ingresos del grupo es la suma de `income` para todos sus períodos en el rango.
- Porcentaje de una categoría: `total_amount / totalIncome * 100`; si `totalIncome` es `0`, mostrar `—`. Usar el total de summary como denominador, no sumar el top.
- El gráfico compara los dos totales agregados de ingresos del rango (B2B frente a B2C), no neto (`net`) ni series mensuales.

### Valores válidos y restricciones

| Parámetro/campo | Restricción |
| --- | --- |
| `operation_type` | Enum `income` o `outcome`; para esta comparación enviar `income`. Default del endpoint top es `outcome`, por lo tanto no omitirlo. En summary es opcional. |
| `limit` | Entero de `1` a `20`, default `5`; para la vista enviar `5`. Es un máximo: puede volver menos filas. |
| `business_type` | Opcional en API, enum `B2B` o `B2C`; es obligatorio para segmentar cada consulta de esta vista. `/api/metrics` no lo soporta. |
| `start_date`, `end_date` | Opcionales; `YYYY-MM-DD`, inclusivos; el mismo rango validado se envía a las cuatro consultas de tops y summary. |
| `group_by` | En summary: `day`, `week` o `month`; default `month`. Enviar `month` para totales mensuales agregables. |
| `category` | Filtro opcional en summary con valores `suppliers`, `sales`, `operational`, `administrative`, `others`; omitir para calcular el total de todas las categorías de ingreso. |
| Categorías disponibles | `facets.categories` es global. Las filas de cada grupo se obtienen del endpoint top filtrado por `business_type`; no inferirlas desde facets. |

### Casos límite y respuesta de UI

1. **Top responde menos de cinco filas (incluido `[]`):** representar solo filas recibidas; no crear categorías placeholders. Si está vacío, mostrar mensaje vacío en la sección B2B/B2C correspondiente. No afirmar que el backend siempre entrega cinco categorías.
2. **`totalIncome === 0` para un negocio:** mostrar total `0` y porcentaje de cada categoría como `—` para evitar división por cero; el gráfico muestra cero para ese negocio y conserva ambas etiquetas/series.

---

## Errores y solicitudes concurrentes

- Un parámetro de fecha malformado puede producir HTTP `422`; presentar un mensaje de validación propio en español, no el texto estándar en inglés de FastAPI.
- Los filtros pueden generar solicitudes concurrentes. Cancelar solicitudes anteriores o descartar sus respuestas si ya no corresponden al rango/umbral actual.
- No convertir errores de red o respuestas fallidas en arrays vacíos: reservar el estado vacío para respuesta exitosa sin resultados y mostrar estado de error cuando la solicitud falla.
