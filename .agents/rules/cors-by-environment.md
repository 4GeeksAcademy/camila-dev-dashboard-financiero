title: Seguridad CORS por Entorno
scope: project
globs:
  - 'backend/app/**/*.py'
  - 'backend/tests/**/*.py'
content:
  - En desarrollo se pueden permitir origenes amplios para iteracion local.
  - En produccion definir lista explicita de origenes confiables.
  - Prohibido combinar allow_origins con comodin y allow_credentials en true.
