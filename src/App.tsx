import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardsPage from './pages/DashboardsPage';

function App() {

  return (
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
      </Routes>
    </Router>
  )
}

export default App
