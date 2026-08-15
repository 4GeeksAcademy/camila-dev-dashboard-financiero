title: Debug Solo en Desarrollo
scope: project
globs:
  - 'backend/Dockerfile'
  - 'docker-compose.yml'
content:
  - La depuracion remota y el autoreload se permiten solo en perfiles de desarrollo.
  - No incluir debugpy ni banderas de debug en imagen o comando de produccion.
