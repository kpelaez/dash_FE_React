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
  badge?: string;
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

// Logo SF para header móvil
  const SFLogoMobile = () => (
    <svg width="36" height="36" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sfGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#047857', stopOpacity:1}} />
          <stop offset="33%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="66%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <rect 
        width="64" 
        height="64" 
        rx="16" 
        fill="url(#sfGradientMobile)" 
        stroke="rgba(255,255,255,0.3)" 
        strokeWidth="1"
      />
      <text 
        x="32" 
        y="42" 
        fontFamily="Space Grotesk, Arial" 
        fontSize="22" 
        fontWeight="800" 
        textAnchor="middle" 
        fill="white"
      >
        SF
      </text>
    </svg>
  );

  // Logo completo para sidebar móvil
  const StonefixerMobileLogo = () => (
    <svg width="160" height="36" viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iconGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#047857', stopOpacity:1}} />
          <stop offset="33%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="66%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="textGradMobile" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#047857', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <rect width="28" height="28" x="4" y="4" rx="7" fill="url(#iconGradMobile)"/>
      <text x="18" y="22" fontFamily="Space Grotesk, Arial" fontSize="12" fontWeight="800" textAnchor="middle" fill="white">SF</text>
      <text x="40" y="18" fontFamily="Space Grotesk, Arial" fontSize="14" fontWeight="800" fill="url(#textGradMobile)">
        StoneFixer
      </text>
      <text x="40" y="28" fontFamily="Inter, Arial" fontSize="8" fill="#6b7280">
        Transformando problemas en soluciones
      </text>
    </svg>
  );


  // Definicion de elementos del menu
  const menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      path: '/',
      icon: <Home size={20} />
    },
    {
      title: 'Indicadores',
      path: '/business-indicators',
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
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
    return hasAnyRole(item.requiredRoles);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsSidebarOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
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
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-gray-100 group-hover:bg-emerald-100 group-hover:text-emerald-600'}
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
              flex items-center justify-between w-full p-3 text-left rounded-xl transition-all duration-200 group
              ${isActive ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 font-semibold' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}
              transition-all duration-200
            `}
          >
            <div className="flex items-center space-x-3">
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
          <div className="ml-6 mt-2 space-y-1 border-l-2 border-emerald-100 pl-4">
            {visibleChildren.map(child => (
              <Link 
                key={child.title}
                to={child.path || '#'}
                onClick={closeSidebar}
                className={`
                  flex items-center px-4 py-2 rounded-lg mx-2 text-sm
                  ${location.pathname === child.path 
                    ? 'bg-emerald-50 text-emerald-600 font-medium' 
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}
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
      <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-emerald-600 text-white sticky top-0 z-40 shadow-xl">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y botón de menú */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                <Menu size={20} />
              </button>
            <Link to="/" className="flex items-center">
              <SFLogoMobile />
            </Link>
            <div>
                <div className="font-bold text-lg">StoneFixer</div>
                <div className="text-xs text-gray-300">Gestión Empresarial</div>
            </div>
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
        </div>
      </header>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            {/* Header del sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
              <StonefixerMobileLogo />
              <button 
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Información del usuario */}
            {isAuthenticated && user && (
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.full_name || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Menú */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-2">
                {visibleMenuItems.map(item => renderMenuItem(item))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer del sidebar móvil */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Contenido principal */}
      <main className="pb-20 overflow-y-auto">
        <div className="px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;