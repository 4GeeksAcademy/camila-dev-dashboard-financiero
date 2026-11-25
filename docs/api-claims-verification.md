# Verificación de afirmaciones de API

Fecha de verificación: 2026-11-25
Rama: `features/frontend-specs`

## Método

1. Lectura de [backend/app/routes.py](../backend/app/routes.py), [backend/app/main.py](../backend/app/main.py) y [frontend/src](../frontend/src); esquema FastAPI disponible en `http://localhost:8000/docs` (HTTP 200).
2. Consultas HTTP reales a `http://localhost:8000` el 2026-11-25. Los importes, las alertas y los límites de fecha de los ejemplos son una instantánea del dataset generado y pueden cambiar con `date.today()`; no deben codificarse como constantes.

## Leyenda

| Estado | Significado |
| --- | --- |
| VERIFICADA | El código y una llamada real confirman la afirmación. |
| INCORRECTA | El código o la respuesta real contradicen la afirmación. |
| SIN VERIFICAR | No se puede confirmar con el código ni con los datos actuales. Requiere una decisión o validación adicional. |
| PARCIAL | Una parte es correcta, pero tiene matices que afectan a la implementación. |

---

## Funcionalidad 1: Filtro de rango de fechas

| # | Afirmación | Estado | Evidencia |
| --- | --- | --- | --- |
| F1-1 | `GET /api/metrics/facets` existe y devuelve el rango de fechas disponible. | VERIFICADA | [routes.py#L262](../backend/app/routes.py#L262). Respuesta real actual: `min_date=2025-11-01`, `max_date=2026-10-28`; ambos valores dependen del dataset dinámico. |
| F1-2 | Las fechas se envían a la API en formato `YYYY-MM-DD`. | VERIFICADA | Los parámetros se tipan como `date` y FastAPI acepta ISO 8601. `start_date=01/05/2026` devolvió **422** en la consulta actual. |
| F1-3 | Hace falta "extender los filtros" del endpoint de métricas para soportar fechas. | INCORRECTA | `GET /api/metrics` ya acepta `start_date` y `end_date` ([routes.py#L248](../backend/app/routes.py#L248)). No hace falta cambiar el backend. Solo hay que enviar los parámetros desde el frontend. |
| F1-4 | Ambos inputs son opcionales y, sin fechas, se devuelven todos los datos. | VERIFICADA | Los dos parámetros son `None` por defecto ([routes.py#L107](../backend/app/routes.py#L107)); sin parámetros se devuelve el dataset completo. El número de movimientos depende de la generación de datos. |
| F1-5 | Los límites del rango son inclusivos. | VERIFICADA | Usa `>= start_date` y `<= end_date`. El test `test_filter_movements_by_date_includes_range_edges` lo cubre. |
| F1-6 | La API rechaza un rango invertido (`start_date > end_date`). | INCORRECTA | `start_date=2026-09-01&end_date=2026-01-01` devuelve **200 `[]`**. Incumple la regla `.agents/rules/date-range-validation.md`. El frontend debe validar el rango antes de enviarlo. |
| F1-7 | `min_date` y `max_date` son fijos. | INCORRECTA | El dataset se genera en función de `date.today()` ([routes.py#L94](../backend/app/routes.py#L94)), así que el rango cambia con la fecha. No se puede escribir en el código. Además, el header actual muestra `"2024 - Full Year"`, que no se corresponde con los datos. |
| F1-8 | `/facets` refleja los filtros activos. | INCORRECTA | `/facets` no acepta parámetros y devuelve siempre el rango global. Si se envía `business_type=B2B`, lo ignora sin error y responde 200 con los mismos datos. |
| F1-9 | El filtro de fechas sirve para "todos los datos de la página" (KPIs y 2 gráficos). | VERIFICADA | Los KPIs y la serie mensual se calculan en el cliente a partir de `/api/metrics` ([App.tsx](../frontend/src/App.tsx)). Al filtrar esa llamada se filtra todo lo que se muestra hoy. |
| F1-10 | Agrupar en el cliente por mes no tiene problemas de zona horaria. | SIN VERIFICAR | `computeMonthlyData` usa `new Date("YYYY-MM-DD")`, que se interpreta en UTC, junto con `getMonth()`, que usa la hora local. En zonas UTC-x, un movimiento del día 1 puede caer en el mes anterior. Falta probarlo. |

## Funcionalidad 2: Tabla de alertas de anomalías

| # | Afirmación | Estado | Evidencia |
| --- | --- | --- | --- |
| F2-1 | `GET /api/metrics/alerts?threshold=<ratio>` existe. | VERIFICADA | [routes.py#L342](../backend/app/routes.py#L342). Responde 200 con `list[MetricsAlert]`. |
| F2-2 | El umbral por defecto es `0.3`. | VERIFICADA | `Query(default=0.3, ge=0)` ([routes.py#L344](../backend/app/routes.py#L344)). |
| F2-3 | El umbral está limitado entre `0.01` y `1.0`. | INCORRECTA | La API solo exige `ge=0`. `threshold=1.5` y `threshold=0.001` devuelven 200. `threshold=-1` devuelve 422. El rango 0.01–1.0 lo tiene que validar el frontend. |
| F2-4 | La columna "media móvil de los 3 períodos anteriores" se corresponde con `baseline_average`. | **INCORRECTA** | `baseline_average` es la media **acumulada de todos** los períodos anteriores, no de los últimos 3 ([routes.py#L219-L239](../backend/app/routes.py#L219-L239)). Decisión documentada en [componentes.md](../frontend/specs/componentes.md): mostrar “Media histórica previa”; no se cambia el backend en este alcance. |
| F2-5 | Se devuelve el "incremento porcentual". | PARCIAL | Se devuelve `increase_ratio` como **ratio** con 4 decimales (por ejemplo, `1.0201`), no como porcentaje. La UI debe multiplicarlo por 100 para mostrarlo (102.0 %). |
| F2-6 | El outcome registrado se devuelve por período. | VERIFICADA | Campo `outcome_total`. `period` usa el formato `YYYY-MM` con `group_by=month`, que es el valor por defecto. |
| F2-7 | El endpoint respeta el rango de fechas. | VERIFICADA | Acepta `start_date` y `end_date`. Ejemplo: `start_date=2026-05-01&end_date=2026-09-30&threshold=0.01` devuelve 3 alertas. |
| F2-8 | Con un rango activo, el baseline tiene en cuenta el historial anterior al rango. | INCORRECTA | El filtro se aplica **antes** de calcular el baseline. En la consulta actual `2026-05-01`–`2026-09-30`, junio tiene baseline `40835.71`, calculado únicamente a partir de mayo; el primer período del rango no puede alertar. Esta limitación se acepta y se explicita en [componentes.md](../frontend/specs/componentes.md). |
| F2-9 | Si no hay anomalías, la API devuelve una lista vacía (no un error). | VERIFICADA | `threshold=1.5` devuelve 200 `[]`. Esto permite mostrar el estado vacío explícito en la UI. |
| F2-10 | La comparación con el umbral es inclusiva. | INCORRECTA | Es estricta: `increase_ratio > threshold` ([routes.py#L230](../backend/app/routes.py#L230)). Un período con un ratio igual al umbral no genera alerta. |
| F2-11 | El orden de las alertas es cronológico. | VERIFICADA | El resumen se ordena por `period` ascendente antes de detectar alertas. |

## Funcionalidad 3: Vista comparativa B2B vs B2C

| # | Afirmación | Estado | Evidencia |
| --- | --- | --- | --- |
| F3-1 | `GET /api/metrics/categories/top?operation_type=income&limit=5` existe. | VERIFICADA | [routes.py#L287](../backend/app/routes.py#L287). `limit` debe estar entre 1 y 20. |
| F3-2 | Admite filtrar por línea de negocio. | VERIFICADA | Admite el parámetro `business_type=B2B\|B2C`. No aparece en el enunciado, pero es necesario. |
| F3-3 | Admite un rango de fechas `YYYY-MM-DD`. | VERIFICADA | Admite `start_date` y `end_date`. |
| F3-4 | Cada línea de negocio tiene 5 categorías de ingreso. | **INCORRECTA** | La consulta actual de top income para B2B y B2C devolvió dos filas en cada caso (`sales`, `others`). El `limit=5` es máximo, no mínimo; la UI acepta menos filas según [componentes.md](../frontend/specs/componentes.md). |
| F3-5 | La respuesta incluye el porcentaje sobre el total del grupo. | INCORRECTA | `CategoryEntry` solo trae `category`, `operation_type` y `total_amount`. La especificación define calcularlo en frontend con el total completo de `/summary`; no hay porcentaje en la respuesta top. |
| F3-6 | La suma del top 5 es igual al total de ingresos del grupo. | PARCIAL | Las consultas actuales devuelven `sales` y `others`, pero no se debe depender de que el top cubra todas las categorías. Usar `/api/metrics/summary?operation_type=income&business_type=X` para el total completo, como establece la especificación. |
| F3-7 | Las categorías de cada grupo se obtienen de `/facets`. | **INCORRECTA** | `/facets` devuelve una lista **global** de categorías (incluye las de outcome: `suppliers`, `operational`, `administrative`), no las de cada línea de negocio, y no acepta `business_type`. Las categorías de cada grupo salen de `/categories/top?business_type=X`. |
| F3-8 | Hay un endpoint que da el total de ingresos de B2B frente a B2C para el gráfico. | PARCIAL | No hay endpoint de total escalar dedicado. `/api/metrics/summary` sí permite obtener los totales completos por negocio: sumar `income` de todos sus períodos. Decisión documentada en [componentes.md](../frontend/specs/componentes.md); no inferirlo del top. |
| F3-9 | El frontend puede añadir "una nueva página". | PARCIAL | No existe un router; la decisión de especificación es una vista `BusinessComparisonPage` con navegación por hash `#comparativa`, sin añadir dependencia. Véase [componentes.md](../frontend/specs/componentes.md). |
| F3-10 | `GET /api/metrics?business_type=...` filtra por línea de negocio. | INCORRECTA | `/api/metrics` **no** acepta `business_type`. Lo ignora y responde 200 con registros de B2B y de B2C. Hay que usar `/api/metrics/b2b`, `/api/metrics/b2c`, o `business_type` en `/summary` o `/categories/top`. |

---

## Hallazgos transversales

- **Parámetros desconocidos:** FastAPI los ignora sin error (F1-8, F3-10). El frontend no puede confiar en que un filtro mal escrito vaya a fallar.
- **Errores 422:** usan el formato estándar de FastAPI (`detail[].msg`, en inglés). La UI debe mostrar un mensaje propio en español (regla `frontend-observable-errors`).
- **Sin cancelación ni registro de errores:** [App.tsx](../frontend/src/App.tsx) no usa `AbortController` y no registra la causa técnica de los errores. Es necesario porque los filtros generan peticiones concurrentes (regla `ui-request-cancellation`).
- **`mock-data.ts` sin uso:** [frontend/src/lib/mock-data.ts](../frontend/src/lib/mock-data.ts) (datos de 2024) no se importa en ningún sitio y no representa el dataset real.

## Decisiones pendientes para el equipo de finanzas

## Decisiones resueltas en la especificación frontend

Las preguntas de decisión que quedaban abiertas en la verificación inicial se cerraron en [`frontend/specs/componentes.md`](../frontend/specs/componentes.md) y [`frontend/specs/README.md`](../frontend/specs/README.md):

1. **F2-4:** usar “Media histórica previa”; no implementar una media móvil de tres períodos.
2. **F2-8:** aceptar y comunicar la limitación actual: el baseline se calcula solo con datos posteriores al filtro de fecha, no con historial previo al rango.
3. **F3-4:** aceptar tablas con menos de cinco categorías, sin filas ficticias.
4. **F3-8:** usar `/summary` segmentado por negocio para total completo, denominador porcentual y gráfico; sumar `income`.
5. **F3-9:** usar hash `#comparativa` para navegación, sin instalar un router.

Estas son decisiones de especificación, no funcionalidades implementadas en el frontend.
