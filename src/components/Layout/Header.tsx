import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Menu } from 'lucide-react';


const Header = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const handleLogout = ()=>{
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 w-full">
      <div className="flex items-center justify-between px-4 py-4 w-full mx-auto">
        <div className="flex items-center space-x-4 flex-grow">
          {/* Botón de menú para móvil */}
          <button className="p-1 rounded-md hover:bg-gray-100 lg:hidden">
            <Menu size={20} />
          </button>
          
          {/* Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar... ¡¡Proximamente!!"
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white w-54"
            />
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-4 absolute right-4">
            {/* Notificaciones */}
            <button className="button-header p-1 rounded-md hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Perfil */}
            <div className="flex items-center space-x-2 ml-4">
              <div className="text-sm text-right">
                <p className="font-medium">{user?.full_name || 'Usuario'}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>

              {/* Boton de cerrar sesion */}
              <button 
                onClick={handleLogout}
                className="button-header text-sm text-emerald-600 hover:text-emerald-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header;