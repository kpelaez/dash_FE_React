import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { ReactNode } from "react";


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace />;
    }
  return children;
}

export default ProtectedRoute;