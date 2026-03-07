import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import SingleDashboardPage from './pages/SingleDashboardPage';
import UserRegisterPage from './pages/UserRegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// ProtectedRoutes
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';



//Nueva pagina de indicadores de negocio
import BusinessIndicatorsPage from './pages/BusinessIndicators/BusinessIndicatorsPage';
import IndicatorsComparisonPage from './pages/BusinessIndicators/IndicatorComparisonPage';
import BusinessIndicatorsChartPage from './pages/BusinessIndicators/BusinessIndicatorsChartPage';
import NetworkDebug from './components/Debug/NetworkDebug';

// Nueva pagina modulo agenda stock
import ShiftSchedulePage from './pages/ShiftSchedulePage/ShiftSchedulePage';


function App() {
 
  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Rutas protegidas basicas (cualquier usuario autenticado) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {<HomePage />}
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/dashboards" 
            element={
              <RoleProtectedRoute requiredRoles={['admin']}>
                <BusinessIndicatorsPage />
              </RoleProtectedRoute>
            } 
          /> */}

          {/* Rutas protegidas por roles */}
          <Route 
            path="/dashboards/:dashboardId" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager']}>
                <SingleDashboardPage />
              </RoleProtectedRoute>
            }  
          />
          
          {/* Nuevas rutas para indicadores de negocio */}
          <Route path="/business-indicators" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <BusinessIndicatorsPage />
            </ProtectedRoute>
          } />

          <Route path="/business-indicators-charts" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <BusinessIndicatorsChartPage />
            </ProtectedRoute>
          } />

          <Route path="/indicators-comparison" element={
            <ProtectedRoute>
              <IndicatorsComparisonPage />
            </ProtectedRoute>
          } />


          <Route 
            path="/teams/administracion/stock/schedule" 
            element={<ShiftSchedulePage />} 
          />
          
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
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <UserRegisterPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/debug" element={<NetworkDebug />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
