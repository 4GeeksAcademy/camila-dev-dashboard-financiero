# Estado Actual

## Features implementadas

### Backend

- Dataset mock de 12 meses con 360 movimientos.
- Filtros por fecha, categoria y tipo de operacion.
- Segmentacion por tipo de negocio (B2B/B2C) en endpoints dedicados.
- Agregaciones por dia, semana y mes.
- Top categorias por monto.
- Comparacion de periodos y delta porcentual.
- Alertas de egresos por umbral.

Evidencia:

- [backend/app/routes.py](../../backend/app/routes.py)
- [backend/tests/test_routes.py](../../backend/tests/test_routes.py)

### Frontend

- Carga de datos desde backend y estados loading/error.
- KPIs de ingresos, egresos, utilidad y margen.
- Grafico Income vs Outcome.
- Grafico Profit Margin %.
- Skeletons de carga y mensajes cuando no hay datos.

Evidencia:

- [frontend/src/App.tsx](../../frontend/src/App.tsx)
- [frontend/src/components/dashboard/kpi-row.tsx](../../frontend/src/components/dashboard/kpi-row.tsx)
- [frontend/src/components/dashboard/income-outcome-chart.tsx](../../frontend/src/components/dashboard/income-outcome-chart.tsx)
- [frontend/src/components/dashboard/profit-percent-chart.tsx](../../frontend/src/components/dashboard/profit-percent-chart.tsx)

## Gaps conocidos

- CORS actualmente permite origenes amplios con credenciales.
- Imagen y compose backend exponen debug remoto.
- Falta validacion explicita de start_date <= end_date en rutas con rango.
- Duplicacion parcial entre endpoints B2B y B2C.
- Manejo de error en frontend sin logging tecnico detallado ni cancelacion de request.

Evidencia:

- [backend/app/main.py](../../backend/app/main.py)
- [backend/Dockerfile](../../backend/Dockerfile)
- [docker-compose.yml](../../docker-compose.yml)
- [backend/app/routes.py](../../backend/app/routes.py)
- [frontend/src/App.tsx](../../frontend/src/App.tsx)

## Siguientes prioridades recomendadas

1. Endurecer seguridad y separacion dev/prod en CORS y debugging.
2. Agregar validacion de rangos de fecha y pruebas de error de cliente.
3. Extraer logica compartida de endpoints por tipo de negocio.
4. Mejorar resiliencia frontend con AbortController y errores observables.
5. Expandir cobertura de pruebas para escenarios de validacion negativa.
