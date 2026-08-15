# Memory Bank del Proyecto

## Proposito

Este directorio concentra contexto operativo y tecnico del proyecto para agentes y contribuidores.
Su funcion es reducir ambiguedad, acelerar onboarding y mantener decisiones documentadas.

## Que contiene

- product-context.md: vision del producto, usuarios, objetivos y metricas de exito.
- architecture.md: stack tecnologico, endpoints y flujo de datos.
- current-state.md: features implementadas, gaps conocidos y siguientes prioridades.
- conventions.md: estandares de codigo y patrones de trabajo.
- architecture-decisions.md: decisiones tecnicas relevantes y su impacto.
- features.md: inventario funcional por area (backend y frontend).

## Como usar este memory bank

- Leer primero product-context.md y current-state.md para entender alcance actual.
- Consultar architecture.md antes de proponer cambios de stack o integraciones.
- Revisar conventions.md y .agents/rules antes de abrir PR.
- Registrar nuevas decisiones en architecture-decisions.md cuando cambie la arquitectura o el comportamiento del sistema.

## Evidencia fuente del repositorio

- [README.md](../../README.md)
- [README.es.md](../../README.es.md)
- [backend/app/main.py](../../backend/app/main.py)
- [backend/app/routes.py](../../backend/app/routes.py)
- [backend/tests/test_routes.py](../../backend/tests/test_routes.py)
- [backend/requirements.txt](../../backend/requirements.txt)
- [frontend/package.json](../../frontend/package.json)
- [frontend/src/App.tsx](../../frontend/src/App.tsx)
- [frontend/src/lib/financial-utils.ts](../../frontend/src/lib/financial-utils.ts)
- [frontend/vite.config.ts](../../frontend/vite.config.ts)
- [docker-compose.yml](../../docker-compose.yml)
