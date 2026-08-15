title: Sin Semilla Global por Request
scope: project
globs:
  - 'backend/app/**/*.py'
content:
  - Prohibido usar random.seed global dentro de requests.
  - Para aleatoriedad deterministica usar instancia local por operacion.
