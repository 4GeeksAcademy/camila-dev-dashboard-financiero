title: Cancelacion de Peticiones en UI
scope: project
globs:
  - 'frontend/src/**/*.tsx'
content:
  - Toda llamada en efectos asincronos debe soportar cancelacion.
  - Evitar setState cuando el componente ya no esta montado.
