import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import IndicatorCard from '../../components/BusinessIndicators/IndicatorCard';
import ChartIndicatorCard from '../../components/BusinessIndicators/ChartIndicatorCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { BusinessIndicator } from '../../types/businessIndicators';
import { getBusinessIndicators } from '../../services/businessIndicatorService';
import { Split, Eye, BarChart3, Layout as LayoutIcon } from 'lucide-react';

const IndicatorsComparisonPage: React.FC = () => {
  const [indicators, setIndicators] = useState<BusinessIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'stacked'>('side-by-side');

  useEffect(() => {
    fetchIndicators();
  }, []);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBusinessIndicators();
      setIndicators(data);
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Cargando comparación de diseños..." />
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
      <div className="indicators-comparison-page p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Split className="w-6 h-6 text-purple-600" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Comparación de Diseños
                </h1>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                Compara las dos versiones de los indicadores: simple vs con gráficos
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    viewMode === 'side-by-side'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Split className="w-4 h-4" />
                  Lado a lado
                </button>
                <button
                  onClick={() => setViewMode('stacked')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    viewMode === 'stacked'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <LayoutIcon className="w-4 h-4" />
                  Apilado
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        {viewMode === 'side-by-side' ? (
          <div className="space-y-8">
            {/* Header de secciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Diseño Simple</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Tarjetas limpias con información esencial y tendencias
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Con Gráficos</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Visualizaciones interactivas con histórico de datos
                </p>
              </div>
            </div>

            {/* Indicadores lado a lado */}
            {indicators.map((indicator) => (
              <div key={indicator.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                  {indicator.name}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Versión simple */}
                  <div className="space-y-2">
                    <div className="text-center text-sm font-medium text-blue-600 mb-3">
                      Versión Simple
                    </div>
                    <IndicatorCard indicator={indicator} />
                  </div>
                  
                  {/* Versión con gráfico */}
                  <div className="space-y-2">
                    <div className="text-center text-sm font-medium text-green-600 mb-3">
                      Con Gráfico
                    </div>
                    <ChartIndicatorCard 
                      indicator={indicator} 
                      chartType="line"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vista apilada */
          <div className="space-y-12">
            {/* Sección Simple */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Diseño Simple</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Minimalista
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {indicators.map((indicator) => (
                  <IndicatorCard key={`simple-${indicator.id}`} indicator={indicator} />
                ))}
              </div>
              
              {/* Pros y contras */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Ventajas</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Carga rápida y rendimiento óptimo</li>
                    <li>• Información clara y directa</li>
                    <li>• Menos espacio en pantalla</li>
                    <li>• Fácil de entender para todos los usuarios</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">❌ Desventajas</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Sin contexto histórico visual</li>
                    <li>• Menos interactividad</li>
                    <li>• Puede parecer básico</li>
                    <li>• No muestra tendencias detalladas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-300"></div>

            {/* Sección con Gráficos */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Con Gráficos</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Interactivo
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {indicators.map((indicator) => (
                  <ChartIndicatorCard 
                    key={`chart-${indicator.id}`} 
                    indicator={indicator} 
                    chartType="area"
                  />
                ))}
              </div>
              
              {/* Pros y contras */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Ventajas</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Contexto visual e histórico</li>
                    <li>• Interactividad y exploración</li>
                    <li>• Detección rápida de patrones</li>
                    <li>• Apariencia más profesional</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">❌ Desventajas</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Mayor tiempo de carga</li>
                    <li>• Más complejo de implementar</li>
                    <li>• Ocupa más espacio</li>
                    <li>• Puede ser abrumador para algunos usuarios</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center mb-4">
            <Split className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-800">
              Recomendaciones del Equipo
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">🎯 Para Usuarios Ejecutivos</h4>
              <p className="text-sm text-purple-700">
                Diseño simple para dashboards ejecutivos donde la información debe ser rápida y clara.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">📊 Para Analistas</h4>
              <p className="text-sm text-purple-700">
                Gráficos interactivos para usuarios que necesitan explorar tendencias y patrones detallados.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">🔄 Solución Híbrida</h4>
              <p className="text-sm text-purple-700">
                Permitir al usuario alternar entre ambas vistas según sus necesidades del momento.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border">
            <span className="text-gray-700 font-medium">¿Cuál prefieres?</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Votar por Simple
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Votar por Gráficos
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Votar por Híbrido
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndicatorsComparisonPage;