title: Validacion de Rangos de Fecha
scope: project
globs:
  - 'backend/app/**/*.py'
  - 'backend/tests/**/*.py'
content:
  - Toda ruta con start_date y end_date debe validar start_date <= end_date.
  - Ante rango invalido responder error de cliente con mensaje claro.
