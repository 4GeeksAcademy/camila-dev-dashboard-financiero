title: Reutilizacion de Logica de Filtros
scope: project
globs:
  - 'backend/app/**/*.py'
  - 'backend/tests/**/*.py'
content:
  - Evitar duplicacion de flujo entre endpoints similares.
  - Extraer funciones comunes para filtros por tipo de negocio y criterios compartidos.
