# Convenciones de Codificacion

## Fuente de verdad

Las reglas del proyecto viven en .agents/rules y deben aplicarse en cada cambio.

Evidencia:

- [AGENTS.md](../../AGENTS.md)
- [language-and-naming-convention.md](../../.agents/rules/language-and-naming-convention.md)
- [enforce-naming-in-pr.md](../../.agents/rules/enforce-naming-in-pr.md)

## Convenciones de lenguaje y naming

- UI y mensajes de error en espanol.
- Nombres de codigo (funciones, clases, interfaces, archivos, carpetas) en ingles.
- React: PascalCase para componentes/tipos, camelCase para utilidades/hooks, carpetas en kebab-case.
- Python: snake_case para funciones/variables/modulos y PascalCase para clases.

Evidencia:

- [language-and-naming-convention.md](../../.agents/rules/language-and-naming-convention.md)

## Convenciones tecnicas actuales

- Mantener contratos tipados en API y frontend.
- Mantener separacion entre logica de metricas y render de UI.
- Mantener pruebas de endpoints y utilidades.
- Mantener proxy local y alias de import en frontend.

Evidencia:

- [strict-api-contracts.md](../../.agents/rules/strict-api-contracts.md)
- [preserve-metrics-ui-separation.md](../../.agents/rules/preserve-metrics-ui-separation.md)
- [preserve-backend-frontend-tests.md](../../.agents/rules/preserve-backend-frontend-tests.md)
- [preserve-dev-proxy-and-aliases.md](../../.agents/rules/preserve-dev-proxy-and-aliases.md)

## Convenciones de calidad para PR

- Validar naming contra regla oficial.
- Exigir pruebas para cambios funcionales (caso feliz + edge case).
- Actualizar documentacion viva cuando cambien decisiones relevantes.

Evidencia:

- [enforce-naming-in-pr.md](../../.agents/rules/enforce-naming-in-pr.md)
- [minimum-test-coverage-per-change.md](../../.agents/rules/minimum-test-coverage-per-change.md)
- [living-documentation-by-category.md](../../.agents/rules/living-documentation-by-category.md)
