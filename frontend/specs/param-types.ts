import type { BusinessType, Category, OperationType } from "./api-types";

/** Parámetros de filtro por fecha aceptados por endpoints que soportan el rango. */
export interface DateRangeFilter {
  /** Fecha inclusiva de inicio, opcional, en formato `YYYY-MM-DD` (OpenAPI `date`). */
  start_date?: string;
  /** Fecha inclusiva de fin, opcional, en formato `YYYY-MM-DD` (OpenAPI `date`). */
  end_date?: string;
}

/** Parámetros de query de `GET /api/metrics/alerts`. */
export interface AlertsParams extends DateRangeFilter {
  /** Ratio estricto de incremento que activa alertas; backend exige `>= 0`, default `0.3`; UI de producto restringe `0.01`–`1.0`. */
  threshold?: number;
  /** Granularidad del período; default `month`, valores válidos: `day`, `week`, `month`. */
  group_by?: "day" | "week" | "month";
  /** Segmentación opcional para alertas; valores válidos: `B2B` y `B2C`. */
  business_type?: BusinessType;
}

/** Parámetros de query de `GET /api/metrics/categories/top`. */
export interface TopsCategoriesParams extends DateRangeFilter {
  /** Tipo de operación para clasificar categorías; valores válidos: `income` y `outcome`. */
  operation_type?: OperationType;
  /** Cantidad máxima de categorías a devolver; entero entre `1` y `20`, default `5`. */
  limit?: number;
  /** Segmentación opcional necesaria para obtener tops independientes por línea de negocio. */
  business_type?: BusinessType;
}

/** Parámetros de query de `GET /api/metrics/summary`, usados para totales de ingresos por grupo. */
export interface SummaryParams extends DateRangeFilter {
  /** Granularidad de agregación; default `month`, valores válidos: `day`, `week`, `month`. */
  group_by?: "day" | "week" | "month";
  /** Tipo de operación opcional; valores válidos: `income` y `outcome`. */
  operation_type?: OperationType;
  /** Categoría opcional; valores válidos: `suppliers`, `sales`, `operational`, `administrative`, `others`. */
  category?: Category;
  /** Línea de negocio opcional; valores válidos: `B2B` y `B2C`. */
  business_type?: BusinessType;
}
