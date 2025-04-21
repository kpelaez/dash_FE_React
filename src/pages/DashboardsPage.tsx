import { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
// import DashboardSelector from '../components/Dashboard/DashboardSelector';
// import DashboardViewer from '../components/Dashboard/DashboardViewer';
// import { useDashboardStore } from '../stores/dashboardStore';

const DashboardsPage = () => {
  // const { 
  //   dashboards, 
  //   selectedDashboard, 
  //   isLoading, 
  //   error,
  //   setSelectedDashboard, 
  //   fetchDashboards 
  // } = useDashboardStore();

  // useEffect(() => {
  //   fetchDashboards();
  // }, [fetchDashboards]);

  return (
    <Layout>
      <div className="dashboards-page">
        <h1>Dashboards</h1>
{/*         
        {isLoading && <p>Cargando dashboards...</p>}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchDashboards}>Reintentar</button>
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="dashboard-container">
            <aside className="sidebar">
              <DashboardSelector 
                dashboards={dashboards}
                onSelect={setSelectedDashboard}
                selectedId={selectedDashboard?.id}
              />
            </aside>
            <div className="content">
              {selectedDashboard ? (
                <DashboardViewer dashboard={selectedDashboard} />
              ) : (
                <div className="no-dashboard">
                  <p>Selecciona un dashboard para visualizar</p>
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>
    </Layout>
  );
};

export default DashboardsPage;