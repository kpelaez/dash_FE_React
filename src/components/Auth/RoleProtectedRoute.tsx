import { ReactNode, useEffect } from 'react';
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
  const roles = useAuthStore((state) => state.roles);
  const getUser = useAuthStore((state) => state.getUser);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading && roles.length === 0) {
      getUser();
    }
  }, [isAuthenticated, isLoading, roles.length, getUser]);

  // Mientras carga, no redirigir — mostrar spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  // Si no esta autenticado, redirigir al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  // Con roles cargados, evaluar permisos
  if (!hasAnyRole(requiredRoles)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  //Si esta autenticado y tiene los roles requeridos, mostrar el contenido

  return (
    <>{children}</>
  )
};

export default RoleProtectedRoute;