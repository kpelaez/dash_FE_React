import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import ChartIndicatorCard from '../../components/BusinessIndicators/ChartIndicatorCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { BusinessIndicator } from '../../types/businessIndicators';
import { getBusinessIndicators } from '../../services/businessIndicatorService';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

const BusinessIndicatorsChartPage: React.FC = () => {
  const [indicators, setIndicators] = useState<BusinessIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'mixed' | 'all-line' | 'all-area' | 'all-bar'>('mixed');

  useEffect(() => {
    fetchIndicators();
  }, []);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBusinessIndicators();
      setIndicators(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Error al cargar los indicadores. Por favor, intenta nuevamente.');
      console.error('Error fetching indicators:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchIndicators();
  };

  // Función para obtener el tipo de gráfico según el indicador y modo
  const getChartType = (indicator: BusinessIndicator) => {
    if (viewMode !== 'mixed') {
      return viewMode.replace('all-', '') as 'line' | 'area' | 'bar';
    }

    // Modo mixto: diferentes tipos para cada indicador
    switch (indicator.id) {
      case 'ventas':
        return 'area';
      case 'cobranzas':
        return 'line';
      case 'cta_cte':
        return 'bar';
      case 'dias_cobro':
        return 'line';
      case 'giro_negocio':
        return 'area';
      default:
        return 'line';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Cargando indicadores con gráficos..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <ErrorMessage 
            message={error} 
            onRetry={handleRefresh}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="business-indicators-chart-page p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Indicadores de Negocio
                </h1>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Con Gráficos
                </span>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                Dashboard con visualizaciones interactivas usando Recharts
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {lastUpdated && (
                <span className="text-xs md:text-sm text-gray-500">
                  Última actualización: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              Tipo de visualización:
            </span>
            <button
              onClick={() => setViewMode('mixed')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'mixed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Layers className="w-3 h-3 inline mr-1" />
              Mixto
            </button>
            <button
              onClick={() => setViewMode('all-line')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'all-line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Líneas
            </button>
            <button
              onClick={() => setViewMode('all-area')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'all-area'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Áreas
            </button>
            <button
              onClick={() => setViewMode('all-bar')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'all-bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Barras
            </button>
          </div>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {indicators.map((indicator) => (
            <ChartIndicatorCard 
              key={indicator.id} 
              indicator={indicator}
              chartType={getChartType(indicator)}
            />
          ))}
        </div>

        {/* Summary Stats */}
        {indicators.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-800">
                Resumen General
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {indicators.filter(i => i.trend === 'up').length}
                </div>
                <div className="text-sm text-blue-600">Indicadores al alza</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-800">
                  {indicators.filter(i => i.trend === 'down').length}
                </div>
                <div className="text-sm text-red-600">Indicadores a la baja</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {indicators.filter(i => i.status === 'good').length}
                </div>
                <div className="text-sm text-green-600">Estado saludable</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-800">
                  {indicators.filter(i => i.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-600">Requieren atención</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {indicators.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay indicadores disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              Los indicadores se están preparando. Intenta actualizar en unos minutos.
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Versión con gráficos Recharts
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                Esta es una versión alternativa que utiliza gráficos interactivos. 
                Compara con la versión simple para decidir cuál funciona mejor para el equipo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessIndicatorsChartPage;