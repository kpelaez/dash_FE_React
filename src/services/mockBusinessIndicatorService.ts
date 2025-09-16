import { 
  BusinessIndicator, 
  BusinessIndicatorsRequest,
  IndicatorHistory,
  IndicatorFormat,
  IndicatorTrend,
  IndicatorColor,
  IndicatorStatus
} from '../types/businessIndicators';

/**
 * Mock service para desarrollo y testing de indicadores de negocio
 * Simula las respuestas del backend con datos realistas
 */
class MockBusinessIndicatorService {
  
  /**
   * Simular delay de red para hacer más realista
   */
  private async simulateNetworkDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtener todos los indicadores de negocio (MOCK)
   */
  async getBusinessIndicators(params?: BusinessIndicatorsRequest): Promise<BusinessIndicator[]> {
    await this.simulateNetworkDelay(800); // Simular llamada al backend

    const mockIndicators: BusinessIndicator[] = [
      {
        id: 'ventas',
        name: 'Ventas',
        value: 2847500,
        previousValue: 2420000,
        format: IndicatorFormat.CURRENCY,
        trend: IndicatorTrend.UP,
        trendPercentage: 17.7,
        color: IndicatorColor.GREEN,
        description: 'Ventas totales del mes actual',
        lastUpdated: new Date().toISOString(),
        target: 3000000,
        status: IndicatorStatus.GOOD
      },
      {
        id: 'cobranzas',
        name: 'Cobranzas',
        value: 2156000,
        previousValue: 2290000,
        format: IndicatorFormat.CURRENCY,
        trend: IndicatorTrend.DOWN,
        trendPercentage: 5.9,
        color: IndicatorColor.BLUE,
        description: 'Cobranzas efectivas del período',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
        target: 2500000,
        status: IndicatorStatus.WARNING
      },
      {
        id: 'cta_cte',
        name: 'Cta. Cte.',
        value: 485200,
        previousValue: 523800,
        format: IndicatorFormat.CURRENCY,
        trend: IndicatorTrend.DOWN,
        trendPercentage: 7.4,
        color: IndicatorColor.YELLOW,
        description: 'Saldo pendiente en cuenta corriente',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
        target: 400000,
        status: IndicatorStatus.WARNING
      },
      {
        id: 'dias_cobro',
        name: 'Días Cobro',
        value: 28,
        previousValue: 34,
        format: IndicatorFormat.DAYS,
        trend: IndicatorTrend.DOWN, // Menos días es mejor
        trendPercentage: 17.6,
        color: IndicatorColor.PURPLE,
        description: 'Días promedio de cobranza',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        target: 25,
        status: IndicatorStatus.GOOD
      },
      {
        id: 'giro_negocio',
        name: 'Giro Negocio',
        value: 3.8,
        previousValue: 3.2,
        format: IndicatorFormat.DECIMAL,
        trend: IndicatorTrend.UP,
        trendPercentage: 18.8,
        color: IndicatorColor.RED,
        description: 'Rotación del capital de trabajo',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
        target: 4.0,
        status: IndicatorStatus.GOOD
      }
    ];

    // Simular posible error ocasional (5% de probabilidad)
    if (Math.random() < 0.05) {
      throw new Error('Error de conexión simulado - Reintenta en unos momentos');
    }

    return mockIndicators;
  }

  /**
   * Obtener un indicador específico por ID (MOCK)
   */
  async getIndicatorById(indicatorId: string, params?: BusinessIndicatorsRequest): Promise<BusinessIndicator> {
    await this.simulateNetworkDelay(300);

    const allIndicators = await this.getBusinessIndicators(params);
    const indicator = allIndicators.find(ind => ind.id === indicatorId);
    
    if (!indicator) {
      throw new Error(`Indicador '${indicatorId}' no encontrado`);
    }

    return indicator;
  }

  /**
   * Obtener histórico de un indicador (MOCK)
   */
  async getIndicatorHistory(
    indicatorId: string, 
    dateFrom?: string, 
    dateTo?: string
  ): Promise<IndicatorHistory[]> {
    await this.simulateNetworkDelay(600);

    const baseValues: Record<string, number> = {
      'ventas': 2500000,
      'cobranzas': 2200000,
      'cta_cte': 500000,
      'dias_cobro': 30,
      'giro_negocio': 3.5
    };

    const baseValue = baseValues[indicatorId] || 1000000;
    const history: IndicatorHistory[] = [];

    // Generar 30 días de historia
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simular variación realista (-15% a +20%)
      const variation = (Math.random() - 0.4) * 0.35;
      const value = Math.round(baseValue * (1 + variation));
      
      const prevValue = i < 29 ? history[history.length - 1]?.value : baseValue;
      const currentTrend = typeof value === 'number' && typeof prevValue === 'number' 
        ? (value > prevValue ? IndicatorTrend.UP : value < prevValue ? IndicatorTrend.DOWN : IndicatorTrend.NEUTRAL)
        : IndicatorTrend.NEUTRAL;

      history.push({
        indicatorId,
        date: date.toISOString(),
        value,
        trend: currentTrend
      });
    }

    return history;
  }

  /**
   * Forzar actualización de indicadores (MOCK)
   */
  async refreshIndicators(): Promise<{ message: string; status: string }> {
    await this.simulateNetworkDelay(2000); // Simular proceso más largo

    // Simular posible falla (10% de probabilidad)
    if (Math.random() < 0.1) {
      throw new Error('Error al actualizar datos desde el sistema ERP');
    }

    return {
      message: 'Indicadores actualizados exitosamente desde fuentes de datos',
      status: 'success'
    };
  }

  /**
   * Obtener estado de salud (MOCK)
   */
  async getIndicatorsHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    lastUpdate: string;
    issues: string[];
  }> {
    await this.simulateNetworkDelay(200);

    const healthScenarios = [
      {
        status: 'healthy' as const,
        lastUpdate: new Date().toISOString(),
        issues: []
      },
      {
        status: 'degraded' as const,
        lastUpdate: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        issues: ['Conexión lenta con base de datos de ventas']
      },
      {
        status: 'down' as const,
        lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        issues: ['Error de conexión con ERP', 'Servicio de cobranzas no disponible']
      }
    ];

    // 70% healthy, 25% degraded, 5% down
    const random = Math.random();
    if (random < 0.7) return healthScenarios[0];
    if (random < 0.95) return healthScenarios[1];
    return healthScenarios[2];
  }
}

// Exportar instancia del mock service
const mockBusinessIndicatorService = new MockBusinessIndicatorService();

// Funciones de conveniencia
export const getMockBusinessIndicators = (params?: BusinessIndicatorsRequest) => 
  mockBusinessIndicatorService.getBusinessIndicators(params);

export const getMockIndicatorById = (indicatorId: string, params?: BusinessIndicatorsRequest) => 
  mockBusinessIndicatorService.getIndicatorById(indicatorId, params);

export const getMockIndicatorHistory = (indicatorId: string, dateFrom?: string, dateTo?: string) => 
  mockBusinessIndicatorService.getIndicatorHistory(indicatorId, dateFrom, dateTo);

export const refreshMockIndicators = () => 
  mockBusinessIndicatorService.refreshIndicators();

export const getMockIndicatorsHealth = () => 
  mockBusinessIndicatorService.getIndicatorsHealth();

export default mockBusinessIndicatorService;