title: Preservar Separacion de Metricas y UI
scope: project
globs:
  - 'frontend/src/components/**/*.tsx'
  - 'frontend/src/lib/**/*.ts'
content:
  - Mantener los calculos de metricas desacoplados del render de componentes.
  - La UI consume utilidades, no reimplementa logica financiera.
