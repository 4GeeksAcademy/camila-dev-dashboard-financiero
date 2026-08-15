title: Contratos de API Estrictos
scope: project
globs:
  - 'backend/app/**/*.py'
  - 'frontend/src/lib/**/*.ts'
content:
  - Todo endpoint nuevo o modificado debe declarar contrato de entrada y salida.
  - Mantener modelos tipados y response_model consistentes con la respuesta real.
