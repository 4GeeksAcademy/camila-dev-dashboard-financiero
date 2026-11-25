/** Valores admitidos por los contratos de métricas, según los enums del OpenAPI. */
export type OperationType = "income" | "outcome";

/** Categorías globales admitidas por el backend; no están filtradas por tipo de negocio. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/** Líneas de negocio admitidas por los endpoints de métricas. */
export type BusinessType = "B2B" | "B2C";

/** Respuesta de `GET /api/metrics/facets`. */
export interface FacetsResponse {
  /**
   * Tipos de operación presentes en el dataset; valores válidos: `income` y `outcome`.
   */
  operation_types: OperationType[];
  /**
   * Líneas de negocio presentes en el dataset; valores válidos: `B2B` y `B2C`.
   */
  business_types: BusinessType[];
  /**
   * Categorías globales presentes en el dataset; puede incluir categorías de ingresos y egresos.
   * No está segmentado por línea de negocio ni por tipo de operación.
   */
  categories: Category[];
  /** Fecha más antigua del dataset, serializada como `YYYY-MM-DD` (formato OpenAPI `date`). */
  min_date: string;
  /** Fecha más reciente del dataset, serializada como `YYYY-MM-DD` (formato OpenAPI `date`). */
  max_date: string;
}

/** Una fila devuelta por `GET /api/metrics/alerts`. */
export interface AlertEntry {
  /** Período agregado; por defecto `YYYY-MM` (`group_by=month`), también admite día o semana. */
  period: string;
  /** Importe total de egresos/outcome del período, como número JSON. */
  outcome_total: number;
  /** Promedio histórico de períodos anteriores, como número JSON; no es una media móvil de 3 períodos. */
  baseline_average: number;
  /** Ratio de incremento sobre la media histórica, no porcentaje; multiplicar por 100 para mostrar %. */
  increase_ratio: number;
}

/** Respuesta de `GET /api/metrics/alerts`; el endpoint devuelve un array, vacío si no hay alertas. */
export type AlertsResponse = AlertEntry[];

/** Una fila devuelta por `GET /api/metrics/categories/top`. */
export interface CategoryEntry {
  /** Categoría de la fila; valores válidos: `suppliers`, `sales`, `operational`, `administrative`, `others`. */
  category: Category;
  /** Tipo de operación de la consulta; valores válidos: `income` y `outcome`. */
  operation_type: OperationType;
  /** Importe agregado de la categoría, como número JSON. */
  total_amount: number;
}

/** Respuesta de `GET /api/metrics/categories/top`; puede tener menos elementos que `limit`. */
export type TopCategoriesResponse = CategoryEntry[];

/** Una fila devuelta por `GET /api/metrics/summary`. */
export interface SummaryEntry {
  /** Período agregado: `YYYY-MM-DD` (día), `YYYY-Www` (semana ISO) o `YYYY-MM` (mes). */
  period: string;
  /** Ingresos/income totales del período, como número JSON. */
  income: number;
  /** Egresos/outcome totales del período, como número JSON. */
  outcome: number;
  /** Neto del período (`income - outcome`), como número JSON. */
  net: number;
}

/** Respuesta de `GET /api/metrics/summary`; permite agregar `income` por período para el gráfico comparativo. */
export type SummaryResponse = SummaryEntry[];
