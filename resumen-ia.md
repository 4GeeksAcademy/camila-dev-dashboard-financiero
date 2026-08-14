# Resumen General
Inspeccioné todas las carpetas dentro de la raíz camila-dev-dashboard-financiero y el proyecto es un dashboard financiero full stack orientado a visualizar métricas de ingresos/egresos, margen y tendencias mensuales.

## El propósito principal es:

1. Exponer datos financieros y agregados desde una API en FastAPI.
2. Consumir esos datos en una UI React para mostrar KPIs y gráficos ejecutivos.
3. Servir como proyecto base educativo para práctica de agentes, reglas y análisis técnico.


## Estructura Del Proyecto (Carpetas)

- .git: metadata de control de versiones Git (historial, refs, objetos, hooks).
- .vscode: configuración local de VS Code, por ejemplo settings.json.
- backend: API y lógica de datos financieros en Python/FastAPI.
- frontend: aplicación web React + TypeScript con gráficos y tarjetas KPI.



### Subcarpetas clave:

- app: app FastAPI, modelos, generación de datos y endpoints.
- tests: pruebas unitarias e integración de endpoints.
- public: recursos públicos (favicon).
- src: código fuente UI.
- assets: assets visuales.
- components: componentes reutilizables.
- dashboard: widgets del tablero.
- ui: primitives visuales base (Card, Skeleton).
- lib: tipos, utilidades financieras y tests.

## Función Del Backend

1. Inicializa FastAPI y CORS en main.py:

 backend/app/main.py
```
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
```

2. Define modelos y endpoints en routes.py:
  - salud: /health

backend/app/routes.py
```
  @router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```
  - dataset de movimientos: /api/metrics
  - filtros/facetas: /api/metrics/facets
  - agregaciones temporales: /api/metrics/summary
  - top categorías: /api/metrics/categories/top
  - comparación de periodos: /api/metrics/comparison
  - alertas de egresos: /api/metrics/alerts
  - vistas por tipo de negocio: /api/metrics/b2b y /api/metrics/b2c

backend/app/routes.py
  ```
  @router.get("/api/metrics/b2b", response_model=list[FinancialMovement])
def get_b2b_metrics(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    category: Category | None = Query(default=None),
    operation_type: OperationType | None = Query(default=None),
) -> list[FinancialMovement]:
    movements = [
        movement for movement in generate_mock_movements(seed=42) if movement.business_type == "B2B"
    ]
    filtered = filter_movements(
        movements, start_date, end_date, category, operation_type
    )
    return ensure_chronological_order(filtered)
```
3. Los datos son mockeados de forma determinística con seed y luego filtrados/agrupados.
4. Pruebas en test_routes.py validan filtros, orden cronológico, contratos de respuesta y      endpoints avanzados.


## Función Del Frontend

1. Punto de entrada en main.tsx y layout principal en App.tsx.
2. Obtiene datos desde /api/metrics y calcula KPIs/mensualizaciones con:
  - financial-utils.ts
  - financial-types.ts
3. Renderiza dashboard con:
  - encabezado: dashboard-header.tsx
  - tarjetas KPI: kpi-row.tsx, kpi-card.tsx
  - gráficos Recharts: income-outcome-chart.tsx, profit-percent-chart.tsx
4. Estilos con Tailwind v4 y variables de tema en index.css.
5. Tests de utilidades en financial-utils.test.ts.


## Infraestructura Y Ejecución

1. Orquestación con Docker Compose en docker-compose.yml: levanta frontend y backend.
2. Backend container en Dockerfile.
3. Frontend container en Dockerfile.
4. Proxy de Vite para /api en vite.config.ts, apuntando al servicio backend.
5. Documentación y propósito del repo en README.md y README.es.md.


##  Conclusión De Propósito

 Este proyecto está diseñado como un tablero financiero ejecutivo de referencia, con datos simulados pero una arquitectura real de producción ligera: API analítica + cliente visual con KPIs y series temporales, incluyendo testing, contenedores y configuración para desarrollo local/Codespaces.

