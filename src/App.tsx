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

// Páginas del módulo de inventario
import InventoryDashboardPage from './pages/Inventory/InventoryDashboardPage';
// import TechAssetsPage from './pages/Inventory/TechAssetsPage';
// import AssignmentsPage from './pages/Inventory/AssignmentsPage';
// import MaintenancePage from './pages/Inventory/MaintenancePage';
// import MyAssetsPage from './pages/Inventory/MyAssetsPage';
// import InventoryReportsPage from './pages/Inventory/InventoryReportsPage';


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
          {/* RUTAS DEL MÓDULO DE INVENTARIO */}
          
          {/* Dashboard de inventario - accesible para roles básicos de inventario */}
          <Route 
            path="/inventory/dashboard" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager', 'user']}>
                <InventoryDashboardPage />
              </RoleProtectedRoute>
            } 
          />

          {/* Gestión de activos tecnológicos - requiere permisos de gestión */}
          {/* <Route 
            path="/inventory/tech-assets" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                <TechAssetsPage />
              </RoleProtectedRoute>
            } 
          /> */}

          {/* Gestión de asignaciones - requiere permisos de gestión */}
          {/* <Route 
            path="/inventory/assignments" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                <AssignmentsPage />
              </RoleProtectedRoute>
            } 
          /> */}

          {/* Gestión de mantenimiento - accesible para técnicos también */}
          {/* <Route 
            path="/inventory/maintenance" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager', 'technician']}>
                <MaintenancePage />
              </RoleProtectedRoute>
            } 
          /> */}

          {/* Mis activos - accesible para todos los usuarios autenticados */}
          {/* <Route 
            path="/inventory/my-assets" 
            element={
              <ProtectedRoute>
                <MyAssetsPage />
              </ProtectedRoute>
            } 
          /> */}

          {/* Reportes de inventario - requiere permisos de gestión */}
          {/* <Route 
            path="/inventory/reports" 
            element={
              <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                <InventoryReportsPage />
              </RoleProtectedRoute>
            } 
          /> */}
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
