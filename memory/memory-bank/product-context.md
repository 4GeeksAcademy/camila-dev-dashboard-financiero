# Product Context

## Resumen

- Producto: dashboard financiero full stack para visualizacion de metricas de ingresos, egresos y margen.
- Proposito: ofrecer una base educativa y tecnica para practicar analisis, reglas de agentes y mejoras incrementales.
- Mercado/uso: estudiantes y equipos tecnicos que necesitan un caso realista de API analitica + UI ejecutiva.

Evidencia:

- [README.md](../../README.md)
- [README.es.md](../../README.es.md)

## Usuarios objetivo y personas

### Persona 1: analista o operador financiero

- Objetivo: entender tendencia mensual de ingresos vs egresos y margen.
- Dolor: revisar datos crudos sin visualizacion consolidada.
- Necesidad en producto: KPIs claros + series temporales.

### Persona 2: desarrollador/a en formacion

- Objetivo: aprender arquitectura de frontend y backend con testing.
- Dolor: proyectos de ejemplo sin contratos API ni pruebas.
- Necesidad en producto: endpoints tipados, utilidades testeadas, entorno reproducible con Docker.

Evidencia:

- [frontend/src/App.tsx](../../frontend/src/App.tsx)
- [frontend/src/components/dashboard/kpi-row.tsx](../../frontend/src/components/dashboard/kpi-row.tsx)
- [backend/tests/test_routes.py](../../backend/tests/test_routes.py)

## Caracteristicas clave del producto

- API de metricas financieras con filtros por fecha, categoria, tipo de operacion y tipo de negocio.
- KPIs principales: total income, total outcome, profit, profit margin.
- Graficos de evolucion mensual y porcentaje de margen.
- Endpoints analiticos adicionales: facets, summary, top categories, comparison, alerts, b2b, b2c.

Evidencia:

- [backend/app/routes.py](../../backend/app/routes.py)
- [frontend/src/components/dashboard/income-outcome-chart.tsx](../../frontend/src/components/dashboard/income-outcome-chart.tsx)
- [frontend/src/components/dashboard/profit-percent-chart.tsx](../../frontend/src/components/dashboard/profit-percent-chart.tsx)

## Objetivos de negocio y resultados esperados

- Reducir tiempo de lectura de salud financiera con una vista unica de KPIs y tendencias.
- Estandarizar una base de referencia para ejercicios de agentes, reglas y memoria de proyecto.
- Mantener un proyecto didactico con stack moderno y pruebas automatizadas.

## Metricas de exito sugeridas

- Cobertura de pruebas en utilidades y endpoints criticos.
- Tiempo de incorporacion de nuevos contribuidores usando el memory bank.
- Tasa de PRs que cumplen reglas en .agents/rules sin retrabajo mayor.
