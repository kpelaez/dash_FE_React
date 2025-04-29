import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, ReactNode } from "react";


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const getUser = useAuthStore(state => state.getUser);
    const isLoading = useAuthStore(state => state.isLoading);
    const location = useLocation();

    //Verificar el token al cargar el componente
    useEffect(()=>{
        if(isAuthenticated) {
            getUser();
        }
    },[isAuthenticated, getUser]);

    // Mientras se verifica el token, indicador de carga
    if(isLoading) {
        return <div className="loading">Verificando autenticacion...</div>;
    }
    
    // Si no esta autenticado redirige al login
    if(!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace />;
    }

  // Si esta autenticado, muestra el contenido protegido  
  return children;
}

export default ProtectedRoute;