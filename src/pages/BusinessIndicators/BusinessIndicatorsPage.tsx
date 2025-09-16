import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import IndicatorCard from '../../components/BusinessIndicators/IndicatorCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { BusinessIndicator } from '../../types/businessIndicators';
import { getBusinessIndicators } from '../../services/businessIndicatorService';


const BusinessIndicatorsPage: React.FC = () => {
  const [indicators, setIndicators] = useState<BusinessIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect( () => {
    fetchIndicators();
  }, []);
  
  const fetchIndicators = async () =>{
    try {
        setLoading(true);
        setError(null);
        const data = await getBusinessIndicators();
        setIndicators(data);
        setLastUpdated(new Date());
    } catch (error) {
        setError('Error al cargar los iondicadores. Por favor, intenta nuevamente.');
        console.error('Error fetching indicators: ', error);
    } finally {
        setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchIndicators();
  };

  if(loading) {
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-content">
                <LoadingSpinner />
            </div>
        </Layout>
    );
  }
  
  if (error) {
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-content">
                <ErrorMessage
                    message={error}
                    onRetry={handleRefresh}
                />
            </div>
        </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="business-indicators-page p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Indicadores de Negocio
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Dashboard principal con métricas clave del negocio
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

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {indicators.map((indicator) => (
            <IndicatorCard 
              key={indicator.id} 
              indicator={indicator}
            />
          ))}
        </div>

        {/* Empty State */}
        {indicators.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
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
      </div>
    </Layout>
  );
}

export default BusinessIndicatorsPage;