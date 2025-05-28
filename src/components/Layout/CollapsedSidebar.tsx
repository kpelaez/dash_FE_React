// src/components/Layout/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Home, BarChart2, Users, 
  Settings, Info, Menu, X, ChevronDown 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

// Tipos para los elementos del menú
interface MenuItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  requiredRoles?: string[];
}

const CollapsibleSidebar = () => {
  const location = useLocation();
  const hasAnyRole = useAuthStore(state => state.hasAnyRole);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Administración: true,
    Teams: true
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Definición de elementos del menú con iconos
  const menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      path: '/',
      icon: <Home size={isCollapsed ? 20 : 18} />
    },
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: <BarChart2 size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'manager']
    },
    {
      title: 'Teams',
      icon: <Users size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'manager'],
      children: [
        {
          title: 'Engineering',
          path: '/teams/engineering',
          icon: <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
        },
        {
          title: 'Human Resources',
          path: '/teams/hr',
          icon: <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
        },
        {
          title: 'Customer Success',
          path: '/teams/customer-success',
          icon: <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
        }
      ]
    },
    {
      title: 'Administración',
      icon: <Settings size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin'],
      children: [
        {
          title: 'Registrar Usuario',
          path: '/admin/register-user',
          icon: <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
        },
        {
          title: 'Listar Usuarios',
          path: '/admin/users',
          icon: <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
        }
      ]
    },
    {
      title: 'Acerca de',
      path: '/about',
      icon: <Info size={isCollapsed ? 20 : 18} />
    }
  ];

  // Toggle para expandir/colapsar secciones
  const toggleExpand = (title: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setTimeout(() => {
        setExpandedItems(prev => ({
          ...prev,
          [title]: !prev[title]
        }));
      }, 150);
    } else {
      setExpandedItems(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };

  // Función para determinar si un elemento del menú debe mostrarse según el rol
  const shouldShowMenuItem = (item: MenuItem): boolean => {
    if (!item.requiredRoles) return true;
    return hasAnyRole(item.requiredRoles);
  };

  // Renderizar un elemento del menú
  const renderMenuItem = (item: MenuItem) => {
    if (!shouldShowMenuItem(item)) return null;
    
    const hasChildren = item.children && item.children.length > 0;
    const visibleChildren = hasChildren && item.children
      ? item.children.filter(shouldShowMenuItem)
      : [];
    
    const isActive = location.pathname === item.path ||
      (hasChildren && visibleChildren.some(child => location.pathname === child.path));
    
    const isExpanded = expandedItems[item.title] || false;
    
    // Si tiene hijos, pero ninguno visible según los roles, no mostrar
    if (hasChildren && visibleChildren.length === 0) return null;

    return (
      <div key={item.title} className="mb-1">
        {/* Elemento principal */}
        {item.path && !hasChildren ? (
          <Link 
            to={item.path}
            className={`
              flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2 rounded-md
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
              transition-colors duration-150
              ${isCollapsed ? 'h-10 w-10 mx-auto' : ''}
            `}
            title={isCollapsed ? item.title : ''}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ) : (
          <button
            onClick={() => toggleExpand(item.title)}
            className={`
              flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} py-2 w-full rounded-md
              ${isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}
              transition-colors duration-150
              ${isCollapsed ? 'h-10 w-10 mx-auto' : ''}
            `}
            title={isCollapsed ? item.title : ''}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.title}</span>}
            </div>
            {!isCollapsed && hasChildren && (
              isExpanded ? 
              <ChevronDown size={16} className="text-gray-500" /> : 
              <ChevronRight size={16} className="text-gray-500" />
            )}
          </button>
        )}
        
        {/* Subelementos */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className={`ml-4 pl-2 border-l border-gray-200 space-y-1 ${isCollapsed ? 'hidden' : 'mt-1'}`}>
            {visibleChildren.map(child => (
              <Link 
                key={child.title}
                to={child.path || '#'}
                className={`
                  flex items-center px-3 py-2 text-sm rounded-md
                  ${location.pathname === child.path 
                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                {child.icon}
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filtrar elementos del menú según roles del usuario
  const visibleMenuItems = menuItems.filter(shouldShowMenuItem);

  return (
    <>
      {/* Sidebar para desktop */}
      <div 
        className={`
          hidden md:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo y botón de colapso */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <img src="/omnimedica-logo.svg" alt="OmniMedica" className="h-8 w-8" />
              <span className="ml-2 font-semibold text-gray-800">OmniMedica</span>
            </div>
          )}
          {isCollapsed && (
            <img src="/omnimedica-icon.svg" alt="OmniMedica" className="h-8 w-8" />
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        {/* Menú */}
        <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {visibleMenuItems.map(item => renderMenuItem(item))}
        </div>
        
        {/* Pie del sidebar */}
        <div className={`
          p-4 border-t border-gray-200 flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'}
        `}>
          {!isCollapsed ? (
            <>
              <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
                {/* Iniciales del usuario */}
                KP
              </div>
              <div className="text-sm">
                <p className="font-medium truncate">Kevin Pelaez</p>
                <p className="text-gray-500 truncate text-xs">kevin@omnimedica.com</p>
              </div>
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
              KP
            </div>
          )}
        </div>
      </div>

      {/* Botón para menú móvil */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar para móvil (como drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar móvil */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <img src="/omnimedica-logo.svg" alt="OmniMedica" className="h-8 w-8" />
                <span className="ml-2 font-semibold text-gray-800">OmniMedica</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Menú móvil */}
            <div className="overflow-y-auto h-full py-4 px-3">
              {visibleMenuItems.map(item => renderMenuItem(item))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollapsibleSidebar;