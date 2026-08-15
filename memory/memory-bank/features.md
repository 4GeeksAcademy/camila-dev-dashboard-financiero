# Features

## Backend features

- Healthcheck de servicio.
- Listado de movimientos con filtros.
- Facetas para poblar filtros en UI.
- Resumen temporal por day/week/month.
- Top categorias por tipo de operacion y limite.
- Comparacion de periodos con delta absoluto y porcentual.
- Alertas por incrementos de outcome sobre baseline.
- Endpoints dedicados para B2B y B2C.

Evidencia:

- [backend/app/routes.py](../../backend/app/routes.py)

## Frontend features

- Dashboard principal con header, fila de KPIs y 2 graficos.
- Estados de carga con skeletons.
- Mensaje de error cuando falla la carga de datos.
- Formateo de moneda y porcentaje.

Evidencia:

- [frontend/src/App.tsx](../../frontend/src/App.tsx)
- [frontend/src/components/dashboard/kpi-card.tsx](../../frontend/src/components/dashboard/kpi-card.tsx)
- [frontend/src/components/dashboard/income-outcome-chart.tsx](../../frontend/src/components/dashboard/income-outcome-chart.tsx)
- [frontend/src/components/dashboard/profit-percent-chart.tsx](../../frontend/src/components/dashboard/profit-percent-chart.tsx)
- [frontend/src/lib/financial-utils.ts](../../frontend/src/lib/financial-utils.ts)

## Testing features

- Tests backend para contratos, filtros y endpoints avanzados.
- Tests frontend para KPIs, series mensuales y formateadores.

Evidencia:

- [backend/tests/test_routes.py](../../backend/tests/test_routes.py)
- [frontend/src/lib/financial-utils.test.ts](../../frontend/src/lib/financial-utils.test.ts)