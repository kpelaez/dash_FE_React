// src/config/dashboards.ts
export interface DashboardConfig {
  id: string;
  title: string;
  url: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  requiredRoles?: string[]; // Para control de acceso
}

// Esta configuración deberá actualizarse con las URLs reales de los dashboards de Martín
export const DASHBOARDS: DashboardConfig[] = [
  {
    id: 'sales-overview',
    title: 'Resumen de Ventas',
    description: 'Visión general de las ventas mensuales y tendencias',
    url: 'http://192.168.0.132:8050/tablero_ventas', // URL del servicio de Dash
    size: 'large',
    requiredRoles: ['admin', 'manager', 'user']
  },
];