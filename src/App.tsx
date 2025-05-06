import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardsPage from './pages/DashboardsPage';
import UserRegisterPage from './pages/UserRegisterPage';

function App() {

  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/" 
            element={
              // <ProtectedRoute>
                <HomePage />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboards" 
            element={
              <ProtectedRoute>
                <DashboardsPage />
              </ProtectedRoute>
            } 
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
              <ProtectedRoute>
                <UserRegisterPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
