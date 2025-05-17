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
// ProtectedRoutes
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';


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
                <HomePage />
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
