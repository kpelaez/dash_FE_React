import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, ReactNode } from "react";
import MainLayout from "../Layout/MainLayout";


interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, requiredRoles = []}) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAnyRole = useAuthStore(state=> state.hasAnyRole);

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

    // Si requiere roles y no los tiene, redirigir a home
    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        return <Navigate to="/" replace />;
    }

  // Si esta autenticado, muestra el contenido protegido  
  return <MainLayout>{children}</MainLayout>;
}

export default ProtectedRoute;