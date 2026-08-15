title: Cobertura Minima por Cambio Funcional
scope: project
globs:
  - 'backend/**/*.py'
  - 'frontend/src/lib/**/*.ts'
  - 'backend/tests/**/*.py'
  - 'frontend/src/lib/**/*.test.ts'
content:
  - Todo cambio funcional en backend o utilidades frontend debe incluir prueba asociada.
  - Cada cambio debe cubrir al menos caso feliz y un edge case.
