import { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
// import DashboardSelector from '../components/Dashboard/DashboardSelector';
// import DashboardViewer from '../components/Dashboard/DashboardViewer';
// import { useDashboardStore } from '../stores/dashboardStore';

const DashboardsPage = () => {

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de estadísticas 1 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Indicador 1</h2>
            <p className="text-3xl font-bold text-indigo-600">24</p>
            <p className="text-sm text-gray-500 mt-2">↑ 12% desde el mes pasado</p>
          </div>
          
          {/* Tarjeta de estadísticas 2 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Indicador 2</h2>
            <p className="text-3xl font-bold text-green-600">3,456</p>
            <p className="text-sm text-gray-500 mt-2">↑ 8% desde el mes pasado</p>
          </div>
          
          {/* Tarjeta de estadísticas 3 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Indicador 3</h2>
            <p className="text-3xl font-bold text-amber-600">15</p>
            <p className="text-sm text-gray-500 mt-2">↓ 3% desde el mes pasado</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardsPage;