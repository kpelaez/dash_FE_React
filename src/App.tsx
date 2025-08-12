import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import DashboardsPage from './pages/DashboardsPage';
import SingleDashboardPage from './pages/SingleDashboardPage';
import UserRegisterPage from './pages/UserRegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
// Paginas Mobile
import MobileLoginPage from './pages/MobileLoginPage';
import MobileHomePage from './pages/MobileHomePage';

// ProtectedRoutes
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';

// Hook para deteccion mobile
import useMobile from './hooks/useMobile';

// Layout Responsive
import ResponsiveLayout from './components/Layout/ResponsiveLayout';
import { useEffect } from 'react';

function App() {
  const { isMobile, touchDevice } = useMobile();

  useEffect(() => {
    // Agregar clases CSS al body para optimizaciones móviles
    if (isMobile || touchDevice) {
      document.body.classList.add('mobile-optimized');
      
      // Prevenir zoom en iOS cuando se enfocan inputs
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    } else {
      document.body.classList.remove('mobile-optimized');
    }

    // Cleanup
    return () => {
      document.body.classList.remove('mobile-optimized');
    };
  }, [isMobile, touchDevice]);

  // Función para decidir qué componente de página usar
  const renderPage = (DesktopComponent: React.ComponentType, MobileComponent?: React.ComponentType) => {
    if (isMobile && MobileComponent) {
      return <MobileComponent />;
    }
    return <DesktopComponent />;
  };

  
  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={renderPage(LoginPage, MobileLoginPage)} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Rutas protegidas basicas (cualquier usuario autenticado) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {renderPage(HomePage, MobileHomePage)}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboards" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager']}>
                <DashboardsPage />
              </RoleProtectedRoute>
            } 
          />

          {/* Rutas protegidas por roles */}
          <Route 
            path="/dashboards/:dashboardId" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager']}>
                <SingleDashboardPage />
              </RoleProtectedRoute>
            }  
          />
          <Route
            ></Route>
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } 
          />
          {/* Ruta para el registro de usuarios */}
          <Route 
            path="/admin/register-user" 
            element={
              <RoleProtectedRoute requiredRoles={['admin']}>
                <UserRegisterPage />
              </RoleProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
