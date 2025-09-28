export interface BusinessIndicator {
  id: string;
  name: string;
  value: number | string;
  previousValue?: number | string;
  unit?: string;
  format: IndicatorFormat;
  trend?: IndicatorTrend;
  trendPercentage?: number;
  icon?: string;
  color?: IndicatorColor;
  description?: string;
  status?: IndicatorStatus;
}

export enum IndicatorFormat {
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  NUMBER = 'number',
  DAYS = 'days',
  DECIMAL = 'decimal'
}

export enum IndicatorTrend {
  UP = 'up',
  DOWN = 'down',
  NEUTRAL = 'neutral'
}

export enum IndicatorColor {
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  GRAY = 'gray'
}

export enum IndicatorStatus {
  GOOD = 'good',
  WARNING = 'warning',
  CRITICAL = 'critical',
  NEUTRAL = 'neutral'
}

// Tipos específicos para cada indicador
export interface VentasIndicator extends BusinessIndicator {
  id: 'ventas';
  name: 'Ventas';
  monthlyGoal?: number;
  ytdTotal?: number;
}

export interface CobranzasIndicator extends BusinessIndicator {
  id: 'cobranzas';
  name: 'Cobranzas';
  pendingAmount?: number;
  collectionRate?: number;
}

export interface CtaCteIndicator extends BusinessIndicator {
  id: 'cta_cte';
  name: 'Cta. Cte.';
  overdueDays?: number;
  totalOverdue?: number;
}

export interface DiasCobroIndicator extends BusinessIndicator {
  id: 'dias_cobro';
  name: 'Días Cobro';
  averageDays?: number;
  benchmarkDays?: number;
}

export interface GiroNegocioIndicator extends BusinessIndicator {
  id: 'giro_negocio';
  name: 'Giro Negocio';
  rotationRate?: number;
  efficiency?: number;
}

// Response del API
export interface BusinessIndicatorsResponse {
  indicators: BusinessIndicator[];
  lastUpdated: string;
  status: 'success' | 'partial' | 'error';
  message?: string;
}

// Request para filtros (para futuras implementaciones)
export interface BusinessIndicatorsRequest {
  dateFrom?: string;
  dateTo?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  includeHistory?: boolean;
}

// Para el histórico de indicadores
export interface IndicatorHistory {
  indicatorId: string;
  date: string;
  value: number | string;
  trend?: IndicatorTrend;
}

// Configuración de cada indicador
export interface IndicatorConfig {
  id: string;
  name: string;
  description: string;
  format: IndicatorFormat;
  defaultColor: IndicatorColor;
  icon: string;
  unit?: string;
  decimalPlaces?: number;
  showTrend: boolean;
  showTarget: boolean;
}