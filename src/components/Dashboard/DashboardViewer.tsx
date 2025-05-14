import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardViewerProps {
    id: string;
    url: string;
    title: string;
    description?: string;
    height?: string;
    showExpandButton?: boolean;
}

const DashboardViewer = ({id, url, title, description, height = '600px', showExpandButton = true}: DashboardViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoad = ()=> {
    setIsLoading(false);
  };

  const handleError = ()=>{
    setIsLoading(false);
    setError('No se pudo cargar el dashboard. Verifique que el servicio esté disponible');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      </div>

      {showExpandButton && (
          <button
            onClick={() => navigate(`/dashboards/${id}`)}
            className="ml-4 p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full"
            title="Ver en pantalla completa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4z" />
              <path d="M17 4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L14.586 5H13a1 1 0 110-2h4z" />
              <path d="M3 16a1 1 0 011-1h4a1 1 0 110 2H6.414l2.293-2.293a1 1 0 01-1.414-1.414L5 13.586V12a1 1 0 01-2 0v4z" />
              <path d="M17 16a1 1 0 011-1v-4a1 1 0 01-2 0v1.586l-2.293-2.293a1 1 0 11-1.414 1.414L14.586 15H13a1 1 0 110 2h4z" />
            </svg>
          </button>
        )}

      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-600">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <iframe 
          src={url}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
};


export default DashboardViewer;