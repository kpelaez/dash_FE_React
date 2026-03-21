import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import SingleDashboardPage from './pages/SingleDashboardPage';
import UserRegisterPage from './pages/UserRegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Páginas del módulo de inventario
import InventoryDashboardPage from './pages/Inventory/InventoryDashboardPage';
import TechAssetsPage from './pages/Inventory/TechAssetsPage';
import AssignmentsPage from './pages/Inventory/AssignmentsPage';
import MaintenancePage from './pages/Inventory/MaintenancePage';
import MaintenanceFormPage from './pages/Inventory/MaintenanceFormPage';
import AssetFormPage from './pages/Inventory/AssetFormPage';
import AssignmentFormPage from './pages/Inventory/AssignmentFormPage';
import MyAssetsPage from './pages/Inventory/MyAssetsPage';
import InventoryReportsPage from './pages/Inventory/InventoryReportsPage';

// Página generacion de Documento de asignación
import AssignmentDetailPage from './pages/Inventory/AssignmentDetailPage';
import UsersManagementPage from './pages/Users/UsersManagementPage';

// Toaster
import { Toaster } from 'react-hot-toast';


// ProtectedRoutes
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';
import AssetDetailPage from './pages/Inventory/AssetDetailPage';

// Nueva pagina modulo agenda stock
import ShiftSchedulePage from './pages/ShiftSchedulePage/ShiftSchedulePage';
import DashboardsPage from './pages/DashboardsPage';


function App() {
 
  return (
    <div className="app-container">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Estilos por defecto
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          // Estilos por tipo
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
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

            <Route 
              path="/teams/stock/schedule" 
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'user']}>
                  <ShiftSchedulePage />
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
              path="/tech-inventory/reports"
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                  <InventoryReportsPage />
                </RoleProtectedRoute>
              }
            />

            {/* Gestión de activos tecnológicos - requiere permisos de gestión */}
            <Route 
              path="/inventory/tech-assets" 
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager', 'user']}>
                  <TechAssetsPage />
                </RoleProtectedRoute>
              } 
            />

            {/* Gestion de activos tecnologicos - requiere permisos de gestion */}
            <Route
              path="/inventory/tech-assets/new"
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                  <AssetFormPage />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/inventory/tech-assets/:id"
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                  <AssetDetailPage />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/inventory/tech-assets/:id/edit"
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                  <AssetFormPage />
                </RoleProtectedRoute>
              }
            />

            {/* Gestión de asignaciones - requiere permisos de gestión */}
            <Route 
              path="/inventory/assignments" 
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager']}>
                  <AssignmentsPage />
                </RoleProtectedRoute>
              } 
            />

            <Route
              path="/inventory/assignments/new"
              element={
                <RoleProtectedRoute requiredRoles={['admin']}>
                  <AssignmentFormPage />
                </RoleProtectedRoute>
              }   
            />

            <Route 
              path='/inventory/assignments/:id' 
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager']}>
                  <AssignmentDetailPage/>
                </RoleProtectedRoute>  
              }            
            />

            {/* Gestión de mantenimiento - accesible para técnicos también */}
            <Route 
              path="/inventory/maintenance" 
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager', 'technician']}>
                  <MaintenancePage />
                </RoleProtectedRoute>
              } 
            />

            <Route 
              path="/inventory/maintenance/new" 
              element={
                <RoleProtectedRoute requiredRoles={['admin', 'manager', 'inventory_manager', 'technician']}>
                  <MaintenanceFormPage />
                </RoleProtectedRoute>
              } 
            />

            {/* Mis activos - accesible para todos los usuarios autenticados */}
            <Route 
              path="/inventory/my-assets" 
              element={
                <ProtectedRoute>
                  <MyAssetsPage />
                </ProtectedRoute>
              } 
            />

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
            <Route
              path="/users"
              element={
                <RoleProtectedRoute requiredRoles={['admin']}>
                  <UsersManagementPage />
                </RoleProtectedRoute>
              }
            />
          </Routes>
        </Router>
    </div>
  )
}

export default App
