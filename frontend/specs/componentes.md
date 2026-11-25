# Especificación de componentes del dashboard financiero

**Estado:** especificación, no implementación.
**Contratos relacionados:** [`api-types.ts`](api-types.ts) y [`param-types.ts`](param-types.ts), verificados contra OpenAPI y respuestas del backend el 2026-11-25.
**Alcance:** componentes, props observables, reglas de presentación y decisiones de producto para las tres funcionalidades solicitadas.

## Convenciones compartidas

- Los componentes son de presentación; la página contenedora coordina solicitudes y entrega datos ya tipados. No se implementan aquí componentes React ni llamadas API.
- Errores de API se presentan con mensajes propios en español; no exponer el texto inglés de FastAPI como mensaje de UI. Los controles que disparen solicitudes concurrentes deben cancelar o descartar respuestas obsoletas.
- Los nombres de campos de datos mantienen el contrato snake_case (`start_date`, `outcome_total`, etc.). Props, componentes y nombres de tipos de UI siguen las convenciones TypeScript/React del proyecto.
- Cada funcionalidad debe soportar carga, error y datos vacíos cuando aplique, sin ocultar de forma ambigua el estado actual.

---

## Funcionalidad 1 — Filtro de rango de fechas del dashboard

### Componentes y ubicación

- `DateRangeFilter`: dos controles de fecha, referencia de disponibilidad y validación del rango.
- Se integra en la parte superior del dashboard principal, junto al encabezado y antes de KPIs/gráficos.
- El contenedor aplica el filtro a la carga de movimientos existente; los KPIs y ambos gráficos se derivan exclusivamente de los movimientos filtrados, para que todas las visualizaciones actuales representen el mismo rango.

### Contrato de props

```ts
interface DateRangeFilterProps {
  value: DateRangeFilter;
  facets: FacetsResponse | null;
  loadingFacets: boolean;
  errorMessage?: string;
  onChange: (value: DateRangeFilter) => void;
}
```

`DateRangeFilter` y `FacetsResponse` se importan desde los archivos de tipos de specs existentes; no se redefinen en el componente.

### Datos y comportamiento

- `facets.min_date` y `facets.max_date` se muestran como referencia legible cerca de los inputs. Son límites globales del dataset, dinámicos; no codificar fechas fijas.
- Los inputs representan `start_date` y `end_date`, opcionales e inclusivos, enviados como `YYYY-MM-DD`. Vacío significa propiedad omitida/no filtro, no una fecha inventada.
- Validar en cliente que, si ambas fechas están presentes, `start_date <= end_date`. Un rango invertido bloquea el envío y muestra un mensaje claro en español. La API actualmente puede responder `200 []` para un rango invertido.
- El límite visual/máximo de cada input se guía por `min_date`/`max_date`; validar además que fechas elegidas no queden fuera del rango disponible. Durante la carga de facets se muestra un estado de carga y los límites no se presentan como conocidos; si facets falla, mostrar error y no inventar el rango.
- Cuando se modifica una fecha, propagar el rango completo; permitir quitar individualmente cada fecha y volver al estado sin filtro.
- Al aplicar/cambiar rango, volver a solicitar los movimientos con los parámetros de fecha y recalcular KPIs y series. Ante cambio rápido de fechas, cancelación o descarte de respuestas viejas es responsabilidad del contenedor.

### Estados y accesibilidad

- Etiquetas visibles y asociadas: “Fecha de inicio” y “Fecha de fin”.
- Texto de referencia: “Datos disponibles: {min_date} – {max_date}”.
- Estado de validación asociado al campo correspondiente, anunciado accesiblemente y sin depender solo de color.
- Mantener controles operables por teclado. El estado de carga/error de facets no debe confundirse con un rango seleccionado.

### Criterios de aceptación

1. Sin fechas seleccionadas, se muestran los datos históricos completos que devuelve el endpoint.
2. Una fecha inicial o final por separado funciona como filtro abierto; ambas son inclusivas.
3. El rango válido afecta a KPIs, gráfico de ingresos/egresos y gráfico de margen por igual.
4. El rango invertido o fuera de límites no se envía como solicitud válida y se explica en español.

---

## Funcionalidad 2 — Tabla de alertas de anomalías

### Componentes y ubicación

- `AlertsPanel`: control de umbral y estado general de la consulta.
- `AlertsTable`: tabla de filas `AlertEntry` y estado vacío explícito.
- El panel se ubica bajo los gráficos existentes en el dashboard principal.

### Contrato de props

```ts
interface AlertsPanelProps {
  alerts: AlertsResponse;
  threshold: number;
  dateRange: DateRangeFilter;
  loading: boolean;
  errorMessage?: string;
  onThresholdChange: (threshold: number) => void;
}
```

`AlertsResponse`, `AlertEntry` y `DateRangeFilter` usan los tipos de specs existentes. El contenedor incluye el umbral y el rango al pedir alertas; `dateRange` es de solo lectura para este panel y se comparte con el filtro principal.

### Columnas y reglas de presentación

| Encabezado visible | Campo | Presentación |
| --- | --- | --- |
| Período | `period` | Por defecto `YYYY-MM` (granularidad mensual del endpoint). |
| Egreso registrado | `outcome_total` | Importe monetario con formato local y dos decimales. |
| Media histórica previa | `baseline_average` | Importe monetario con formato local y dos decimales. |
| Incremento | `increase_ratio` | Mostrar `increase_ratio * 100` con formato porcentual; el valor API es ratio, no porcentaje. |

### Decisiones para cerrar ambigüedades del brief

- **Nombre de baseline:** se usará “Media histórica previa”, no “Media móvil de los 3 períodos anteriores”. El endpoint calcula promedio acumulado de todos los períodos previos visibles; afirmar una ventana de tres sería incorrecto. Cambiar el encabezado solo cuando el backend implemente y documente una media móvil real.
- **Rango activo:** se envía el mismo `DateRangeFilter` al endpoint de alertas. La API filtra movimientos antes de calcular el baseline, por lo que no incorpora historial previo al inicio del rango y el primer período no puede alertar. Esto se acepta como limitación explícita de la versión actual, no se simula un baseline más correcto en la tabla.
- **Umbral:** valor inicial `0.3`; control numérico con valores válidos de UI entre `0.01` y `1.0`. El backend hoy valida solo `threshold >= 0`; la restricción de producto debe validarse en frontend. No mostrar “30 %” como valor transmitido: el parámetro enviado es ratio `0.3`.
- La detección compara estrictamente `increase_ratio > threshold`; una igualdad no genera alerta.
- La comparación B2B/B2C no altera esta tabla del dashboard principal; `business_type` es opcional en API pero queda fuera de las props de este alcance.

### Estados y comportamiento

- Durante carga, conservar el control y mostrar un indicador de carga dentro del panel.
- Si la respuesta es `[]`, mantener título/tabla y mostrar el estado vacío: “No se detectaron anomalías para este umbral y rango de fechas.”
- En error, mostrar mensaje en español y permitir que la UI se recupere al cambiar umbral/rango o reintentar según el contenedor.
- Mostrar alertas en orden cronológico ascendente, tal como las devuelve el backend.
- El umbral debe validarse antes de solicitar; cambios de umbral o rango cancelan/descartan solicitudes obsoletas.
- Tabla semántica con encabezados asociados a columnas; el mensaje de estado vacío debe ser anunciado por tecnologías de asistencia.

### Criterios de aceptación

1. Umbral inicial de `0.3`, y entradas fuera de `[0.01, 1.0]` son rechazadas con explicación en español.
2. El rango activo se refleja en la consulta; no se afirma que el baseline incluya meses anteriores al rango.
3. La columna de incremento convierte el ratio a porcentaje solo para mostrar.
4. Una lista vacía muestra un estado vacío visible, no hace desaparecer la tabla/panel.

---

## Funcionalidad 3 — Vista comparativa B2B vs B2C

### Navegación y disposición

- Crear una vista de aplicación llamada `BusinessComparisonPage`, alcanzable desde navegación visible del dashboard.
- **Decisión de navegación:** usar navegación por hash (`#comparativa`) gestionada por la aplicación existente; no agregar un router/dependencia para una única vista. El hash permite enlace directo y navegación atrás/adelante del navegador. El dashboard principal permanece en la ruta/hash por defecto.
- La página incluye filtro de rango propio con las mismas reglas y componente `DateRangeFilter` de la Funcionalidad 1. Su estado se comparte dentro de la vista y se aplica a las dos líneas, no a solo una.
- En escritorio, dos secciones de tabla B2B y B2C se disponen en paralelo; en pantallas estrechas se apilan. Bajo ambas secciones se muestra un gráfico único de ingresos totales.

### Componentes y contratos de props

```ts
interface BusinessComparisonPageProps {
  dateRange: DateRangeFilter;
  facets: FacetsResponse | null;
  b2bCategories: TopCategoriesResponse;
  b2cCategories: TopCategoriesResponse;
  b2bSummary: SummaryResponse;
  b2cSummary: SummaryResponse;
  loading: boolean;
  errorMessage?: string;
  onDateRangeChange: (value: DateRangeFilter) => void;
}

interface BusinessCategorySectionProps {
  businessType: BusinessType;
  categories: TopCategoriesResponse;
  totalIncome: number;
  loading: boolean;
}

interface BusinessIncomeComparisonChartProps {
  b2bTotalIncome: number;
  b2cTotalIncome: number;
  loading: boolean;
}
```

Todos los tipos de respuesta/negocio/rango se importan desde `api-types.ts` y `param-types.ts`; las interfaces anteriores describen props de presentación, no nuevos contratos API.

### Origen de datos y reglas de cálculo

- Para cada línea, solicitar `/api/metrics/categories/top` con `operation_type=income`, `limit=5`, el rango activo y `business_type=B2B` o `B2C`.
- Para cada línea, solicitar `/api/metrics/summary` con `operation_type=income`, el mismo rango, `business_type` correspondiente y `group_by=month` (default). El total del grupo es la suma de `income` de todos los elementos de `SummaryResponse`.
- **Porcentaje de categoría:** `CategoryEntry` no incluye porcentaje. Calcular `total_amount / totalIncome * 100`; si `totalIncome` es cero, mostrar `—` (no dividir por cero). Formatear como porcentaje. El denominador es el ingreso completo del grupo en el rango, no la suma del top, para seguir siendo correcto si aparecen más categorías o si el top está truncado.
- **Gráfico:** comparar un valor de ingreso total B2B contra un valor de ingreso total B2C para el rango seleccionado, no beneficio neto ni valores por mes. Las series/valores se derivan de los dos `SummaryResponse` y se pasan al gráfico como totales agregados.
- `/api/metrics/facets` sirve para mostrar las fechas disponibles y conocer los valores de `business_types`; sus `categories` son globales y mezclan categorías de ingresos y egresos. No usar `facets.categories` para poblar las filas de cada negocio: las filas provienen de los endpoints de top categorías.
- No asumir que el top devuelve cinco filas. Con el dataset verificado de ingresos puede devolver dos (`sales`, `others`); dibujar solo las filas recibidas, sin placeholders ficticios.

### Estados y accesibilidad

- Las dos secciones deben compartir el mismo estado de carga/error y rango; no presentar una como actualizada y otra como si correspondiera al mismo filtro cuando una petición falla.
- Cada tabla tiene título de sección explícito (“B2B”/“B2C”), columnas “Categoría”, “Ingresos” y “% del total del grupo”.
- Si no hay ingresos, mostrar filas vacías según el estado de datos y porcentaje `—`; si no hay categorías, mostrar mensaje de estado vacío en la sección.
- El gráfico tiene título, leyenda/texto alternativo o resumen accesible que comunica los dos totales y sus nombres.
- Navegación por hash responde a cambios de hash y a atrás/adelante; el enlace actual se identifica visualmente y mediante `aria-current`.
- Fechas invertidas/fuera de disponibilidad siguen la validación de la Funcionalidad 1. Cambios de rango cancelan o descartan respuestas previas para los cuatro grupos de datos (dos tops y dos summaries).

### Criterios de aceptación

1. B2B y B2C presentan tablas independientes con datos de ingreso y fechas idénticas.
2. El porcentaje usa el total de ingresos del grupo obtenido de summary, no el subtotal top-5.
3. El gráfico compara el ingreso total de ambos grupos para el rango actual.
4. Categorías o filas menores a cinco se presentan tal cual, sin errores ni filas inventadas.
5. Las facetas se usan para rango disponible, no como fuente de categorías de cada negocio.

---

## Registro de decisiones resueltas

| Ambigüedad | Decisión de esta especificación | Justificación / límite |
| --- | --- | --- |
| Alertas: media móvil de 3 versus `baseline_average` | Etiquetar “Media histórica previa”. | El backend calcula promedio acumulado, no ventana móvil de tres períodos. |
| Alertas con rango: historial anterior | Aceptar comportamiento actual filtrado; documentar que el baseline no atraviesa el inicio del rango. | Es el comportamiento real del endpoint. Una futura corrección de producto/API requiere cambiar esta spec. |
| Top de cinco versus menos filas | Permitir hasta cinco, sin mínimo. | Respuestas verificadas para B2B y B2C tienen dos categorías. |
| Navegación para nueva página | Hash `#comparativa`, sin dependencia de router. | El frontend no tiene router; mantiene el alcance pequeño y permite enlaces/historial. |
| Total del gráfico y porcentaje de grupo | Usar `/summary` segmentado y sumar `income`. | Evita asumir que las cinco categorías cubren todos los ingresos. |
| Categorías por línea desde facets | No usar facets para poblar las tablas. | Facets devuelve categorías globales; top categories filtra por `business_type`. |
