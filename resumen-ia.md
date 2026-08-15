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


## Buenas Prácticas
 
### Arquitectura

- Contratos tipados claros en API con Pydantic y response_model.
Modelos y respuestas están bien definidos en:

 routes.py:18, 
 routes.py:248,
 routes.py:262,
 routes.py:305.

- Restricciones de parámetros en query para evitar entradas inválidas.
Ejemplos en:

 routes.py:290 (limit con ge/le) 
 routes.py:344 (threshold con ge=0).

- Separación de lógica de negocio en funciones puras y reutilizables.
Buenas funciones en:

 routes.py:95,
 routes.py:112,
 routes.py:151,
 routes.py:219.

- Frontend con tipado fuerte y utilidades desacopladas del render.
Cálculos en:

 financial-utils.ts:21,
 financial-utils.ts:36

Uso de tipos de dominio en financial-types.ts.

### Testing

- Tests unitarios de utilidades frontend con casos útiles (orden cronológico y edge cases).
Ver:

 financial-utils.test.ts:63,
 financial-utils.test.ts:47

Y en backend en 
 
 test_routes.py

### DX 

- Configuración de desarrollo bien resuelta con proxy API y alias de imports en: 

vite.config.ts:12,
vite.config.ts:20 

Esto mejora DX y evita CORS en local.


## Malas Prácticas

### Seguridad

-  CORS demasiado permisivo para cualquier origen con credenciales habilitadas.
En 

main.py:9 y
main.py:10 
 
se usa allow_origins con comodín y allow_credentials en true. Esto es riesgoso en despliegue real y puede abrir exposición de cookies/tokens entre orígenes.

 -  Puerto de depuración expuesto en Docker Compose.
En 

docker-compose.yml:20 

se publica 5678 (debug remoto).
Es útil para desarrollo, pero incrementa superficie de ataque si no está acotado al entorno local.

### Infra/Operación

-  Imagen de backend en modo desarrollo/debug en el comando principal.
En

 Dockerfile:12 
 
 se arranca con debugpy y --reload. Si este contenedor se reutiliza fuera de local, hay riesgo de seguridad y consumo innecesario de recursos.



## Arquitectura

-  Duplicación de lógica entre endpoints B2B/B2C.
Las funciones en 

routes.py:362 y 
routes.py:378

repiten casi el mismo flujo cambiando solo el filtro de business_type. Esto aumenta costo de mantenimiento y riesgo de divergencia.

- Uso de semilla global de random dentro de requests.
En 

routes.py:85

se llama random.seed sobre el generador global. En escenarios concurrentes esto puede producir efectos secundarios entre llamadas y acoplamiento no deseado.

### API/Validación

-  Falta validación de coherencia de fechas en endpoints de comparación y filtros.
En 

routes.py:307 y
routes.py:308

no se valida explícitamente que start_date <= end_date. Puede generar comparaciones ambiguas o resultados inconsistentes según el rango enviado.

### DX

-  Manejo de errores frontend poco informativo y sin cancelación de petición.
En

 App.tsx:35 

se captura error genérico sin registrar causa técnica ni diferenciar tipos de fallo; además no hay AbortController para evitar actualización de estado tras desmontaje.

### Naming/Consistencia

- Falta definir regla de consistencia de idioma y convenciones de nombres para mensajes/UI/API.


## Set de Reglas Propuestas

### Reglas de Mitigación de Riesgos

1. Seguridad CORS por entorno:
En desarrollo se permiten orígenes amplios; en producción se usa una lista explícita de orígenes confiables y no se combina comodín con credenciales.

2. Debug aislado de producción:
Depuración remota y recarga automática solo en perfil de desarrollo, nunca en imagen o comando de producción.

3. Puertos sensibles no públicos:
Los puertos de depuración no se exponen en entornos compartidos; si se requieren, se limitan a red interna o localhost.

4. Validación obligatoria de rangos:
Toda ruta con fechas valida inicio menor o igual a fin y devuelve error de cliente con mensaje claro cuando falla.

5. Sin estado global mutable por request:
No usar semilla global compartida por request; usar instancia local para generación pseudoaleatoria determinística.

6. Reutilización de lógica de filtros:
Evitar duplicación entre endpoints similares; extraer funciones comunes para filtrar por tipo de negocio y otros criterios.

7. Contratos de API estrictos:
Mantener modelos tipados y respuestas declaradas; cualquier endpoint nuevo debe declarar contrato de entrada y salida.

8. Errores frontend observables:
Cada error de red debe registrar causa técnica y mostrar mensaje amigable sin ocultar contexto de diagnóstico.

9. Cancelación de peticiones en UI:
Toda llamada en efectos debe tener cancelación para evitar actualización de estado cuando el componente ya no está montado.

10. Convención de idioma y naming:
Definirel idioma español para textos de UI y mensajes de error, y usar idioma inglés para nombres de funciones, archivos, carpetas, interfaces, clases, etc.ç

 En React usar las siguientes convenciones de nomenclatura:
  - PascalCase: componentes React y tipos/interfaces de Typescript
  - camelCase: hooks y funciones utilitarias 
  - kebab-case: nombre de carpetas.

En Python usar:
  - Funciones y variables: snake_case (ej. calcular_precio(), resultado_final).
  - Archivos y módulos: Usan snake_case en minúsculas y deben ser nombres cortos (ej. procesar_datos.py)  - Carpetas y paquetes: Usan minúsculas pegadas y sin guiones (ej.mipaquete).
  - Clases: Usan PascalCase (o CapWords), con mayúscula inicial en cada palabra (ej. UsuarioAdministrador).


11. Aplicar una convención única de naming (funciones, componentes, interfaces, clases, archivos y carpetas) y validarla en PR.git 

12. Cobertura mínima por cambio:
Cada cambio funcional en backend o utilidades frontend debe incluir prueba asociada y cubrir caso feliz más al menos un edge case.

13. Documentación viva por categoría:
Mantener una sección de decisiones técnicas con cuatro bloques: seguridad, arquitectura, operación y DX, actualizada en cada PR relevante.

### Reglas de Preservación de Patrones Útiles

1. Mantener contratos tipados en API y frontend.
2. Mantener separación entre cálculo de métricas y componentes de UI.
3. Mantener tests de utilidades y tests de endpoints.
4. Mantener proxy local y alias para buena experiencia de desarrollo.
5. Mantener organización por dominio en componentes y librerías.

### Checklist de Aceptación para PR

1. ¿Hay impacto en seguridad de CORS, puertos o debug?
2. ¿Se validan entradas nuevas o modificadas?
3. ¿Se evitó duplicar lógica existente?
4. ¿Se agregaron o ajustaron pruebas?
5. ¿Se actualizó documentación técnica si cambió una regla?