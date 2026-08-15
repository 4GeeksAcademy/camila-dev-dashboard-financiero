title: Puertos Sensibles No Publicos
scope: project
globs:
  - 'docker-compose.yml'
  - '**/Dockerfile'
content:
  - Los puertos de depuracion no deben exponerse en entornos compartidos.
  - Si son necesarios, limitarlos a red interna o localhost.
