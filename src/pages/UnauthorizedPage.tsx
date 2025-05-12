import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-4xl">
            403
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Acceso Denegado</h1>
          
          <p className="mt-2 text-gray-600">
            No tienes permisos suficientes para acceder a esta página.
          </p>
          
          <div className="mt-6">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;