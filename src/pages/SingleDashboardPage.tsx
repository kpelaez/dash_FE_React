import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import DashboardViewer from '../components/Dashboard/DashboardViewer';
import { DASHBOARDS, DashboardConfig } from '../config/dashboards';
import { useAuthStore } from '../stores/authStore';
import useMobile from '../hooks/useMobile';
import MobileDashboardViewer from '../components/Dashboard/MobileDashboardViewer';

const SingleDashboardPage = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const { hasAnyRole } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isMobile } = useMobile();

  useEffect(() => {
    if (!dashboardId) {
      setError('ID de dashboard no especificado');
      setIsLoading(false);
      return;
    }

    // Buscar el dashboard por ID
    const foundDashboard = DASHBOARDS.find(d => d.id === dashboardId);
    
    if (!foundDashboard) {
      setError('Dashboard no encontrado');
      setIsLoading(false);
      return;
    }

    // Verificar permisos
    if (foundDashboard.requiredRoles && foundDashboard.requiredRoles.length > 0) {
      if (!hasAnyRole(foundDashboard.requiredRoles)) {
        setError('No tienes permisos para ver este dashboard');
        setIsLoading(false);
        return;
      }
    }

    setDashboard(foundDashboard);
    setIsLoading(false);
  }, [dashboardId, hasAnyRole]);

  // Función para renderizar el dashboard según el dispositivo
  const renderDashboardViewer = () => {
    if (!dashboard) return null;

    if (isMobile) {
      return (
        <MobileDashboardViewer
          id={dashboard.id}
          url={dashboard.url}
          title={dashboard.title}
          description={dashboard.description}
          fullScreen={true}
        />
      );
    }

    return (
      <DashboardViewer
        id={dashboard.id}
        url={dashboard.url}
        title={dashboard.title}
        description={dashboard.description}
        height="800px"
        showExpandButton={false}
      />
    );
  };

  // Función para renderizar el contenido del layout
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                  onClick={() => navigate('/dashboards')}
                >
                  Volver a Dashboards
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!dashboard) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Dashboard no encontrado</p>
        </div>
      );
    }

    return (
      <div>
        {!isMobile && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{dashboard.title}</h1>
              {dashboard.description && (
                <p className="mt-1 text-sm text-gray-500">{dashboard.description}</p>
              )}
            </div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-md hover:bg-indigo-50"
              onClick={() => navigate('/dashboards')}
            >
              Volver
            </button>
          </div>
        )}
        
        {renderDashboardViewer()}
      </div>
    );
  };

  // Para móvil, no usar el Layout wrapper ya que MobileDashboardViewer maneja su propio layout
  if (isMobile) {
    return renderContent();
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="px-4 sm:px-6 md:px-8">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default SingleDashboardPage;