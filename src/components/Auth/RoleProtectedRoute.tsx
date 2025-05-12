import {ReactNode} from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleProtectedRouteProps {
    children: ReactNode;
    requiredRoles: string[];
    redirectTo?: string;
}

const RoleProtectedRoute = ({children, requiredRoles, redirectTo = '/unauthorized'}: RoleProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const hasAnyRole = useAuthStore(state => state.hasAnyRole);
  const isLoading = useAuthStore(state => state.isLoading);
  const location = useLocation();

  // Si esta cargando, mostrar spinner
  if(isLoading) {
    return <div className='loading'>Cargando...</div>;
  }

  // Si no esta autenticado, redirigir al Login
  if(!isAuthenticated) {
    return <Navigate to='/login' state={{from: location}} replace />
  }

  // Si no tiene los roles requeridos, redirigir a pagina de no autorizado
  if(!hasAnyRole(requiredRoles)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace/>;
  }

  //Si esta autenticado y tiene los roles requeridos, mostrar el contenido

  return (
    <>{children}</>
  )
};

export default RoleProtectedRoute;