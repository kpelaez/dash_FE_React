import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { BarChart2, Bell, ChevronDown, ChevronRight, Home, Info, LogOut, Menu, PlusCircle, Search, Settings, Users, X } from 'lucide-react';

interface MenuItem {
    title: string;
    path?: string;
    icon: React.ReactNode;
    children?: MenuItem[];
    requiredRoles?: string[];
}

interface MobileLayoutProps {
    children: React.ReactNode;
}

const MobileLayout = ({children}: MobileLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasAnyRole = useAuthStore(state => state.hasAnyRole);
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Definicion de elementos del menu
  const menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      path: '/',
      icon: <Home size={20} />
    },
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: <BarChart2 size={20} />,
      requiredRoles: ['admin', 'manager']
    },
    {
      title: 'Sectores',
      icon: <Users size={20} />,
      requiredRoles: ['admin', 'manager'],
      children: [
        { title: 'Directorio', path: '/teams/directorio', icon: <div className="w-2 h-2 rounded-full bg-blue-400"></div> },
        { title: 'D.A.T.', path: '/teams/desarrollo', icon: <div className="w-2 h-2 rounded-full bg-green-400"></div> },
        { title: 'Recursos Humanos', path: '/teams/rrhh', icon: <div className="w-2 h-2 rounded-full bg-purple-400"></div> },
        { title: 'Comercio Exterior', path: '/teams/comex', icon: <div className="w-2 h-2 rounded-full bg-yellow-400"></div> },
        { title: 'Comercial', path: '/teams/comercial', icon: <div className="w-2 h-2 rounded-full bg-red-400"></div> },
        { title: 'Administración', path: '/teams/administracion', icon: <div className="w-2 h-2 rounded-full bg-indigo-400"></div> }
      ]
    },
    {
      title: 'SF Administración',
      icon: <Settings size={20} />,
      requiredRoles: ['admin'],
      children: [
        {
          title: 'Registrar Usuario',
          path: '/admin/register-user',
          icon: <PlusCircle size={16} />
        },
        {
          title: 'Listar Usuarios',
          path: '/admin/users',
          icon: <Users size={16} />
        }
      ]
    },
    {
      title: 'Acerca de',
      path: '/about',
      icon: <Info size={20} />
    }
  ];

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const shouldShowMenuItem = (item: MenuItem): boolean => {
    if (!item.requiredRoles) return true;
    return hasAnyRole(item.requiredRoles);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsSidebarOpen(false);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!shouldShowMenuItem(item)) return null;
    
    const hasChildren = item.children && item.children.length > 0;
    const visibleChildren = hasChildren && item.children
      ? item.children.filter(shouldShowMenuItem)
      : [];
    
    if (hasChildren && visibleChildren.length === 0) return null;
    
    const isActive = location.pathname === item.path ||
      (hasChildren && visibleChildren.some(child => location.pathname === child.path));
    
    const isExpanded = expandedItems[item.title] || false;
    
    return (
      <div key={item.title} className="mb-1">
        {/* Elemento principal */}
        {item.path && !hasChildren ? (
          <Link 
            to={item.path}
            onClick={closeSidebar}
            className={`
              flex items-center px-4 py-3 rounded-lg mx-2
              ${isActive 
                ? 'bg-emerald-50 text-emerald-600 font-medium border-l-4 border-emerald-500' 
                : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'}
              transition-all duration-200
            `}
          >
            <span className="flex-shrink-0 mr-3">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
          </Link>
        ) : (
          <button
            onClick={() => toggleExpand(item.title)}
            className={`
              flex items-center justify-between w-full px-4 py-3 rounded-lg mx-2
              ${isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}
              transition-all duration-200
            `}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 mr-3">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </div>
            {hasChildren && (
              <div className="ml-2">
                {isExpanded ? 
                  <ChevronDown size={16} className="text-gray-500" /> : 
                  <ChevronRight size={16} className="text-gray-500" />
                }
              </div>
            )}
          </button>
        )}
        
        {/* Subelementos */}
        {hasChildren && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {visibleChildren.map(child => (
              <Link 
                key={child.title}
                to={child.path || '#'}
                onClick={closeSidebar}
                className={`
                  flex items-center px-4 py-2 rounded-lg mx-2 text-sm
                  ${location.pathname === child.path 
                    ? 'bg-emerald-50 text-emerald-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'}
                  transition-all duration-200
                `}
              >
                <span className="mr-2">{child.icon}</span>
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const visibleMenuItems = menuItems.filter(shouldShowMenuItem);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Botón de menú y logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <img 
                src="/Logo-text-small.png" 
                alt="Omnimedica" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Iconos de la derecha */}
          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar... ¡Próximamente!"
              className={`
                w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white
                transition-all duration-200
                ${isSearchFocused ? 'bg-white ring-2 ring-emerald-500' : ''}
              `}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>
      </header>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header del sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <img src="/Logo-text-small.png" alt="Omnimedica" className="h-8 w-auto" />
              </div>
              <button 
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Información del usuario */}
            {isAuthenticated && user && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-medium">
                    {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.full_name || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Menú */}
            <div className="flex-1 overflow-y-auto py-4">
              {visibleMenuItems.map(item => renderMenuItem(item))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="min-h-screen pb-4">
        <div className="px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;