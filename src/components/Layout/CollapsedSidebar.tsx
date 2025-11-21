// src/components/Layout/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Home, BarChart2, Users, 
  Settings, Info, Menu, X, ChevronDown, PlusCircle, BookUser
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

// Tipos para los elementos del menú
interface MenuItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
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
      title: 'Indicadores',
      path: '/business-indicators',
      icon: <BarChart2 size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'manager']
    },
    {
      title: 'Sectores',
      icon: <Users size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'manager'],
      children: [
          {
            title: 'Directorio',
            path:'/teams/directorio'
          },
          {
          title: 'D.A.T.',
          path: '/teams/desarrollo',
          },
          {
          title: 'Recursos Humanos',
          path: '/teams/rrhh',
          },
          {
          title: 'Comercio Exterior',
          path: '/teams/comex',
          },
          {
          title: 'Comercial',
          path: '/teams/comercial',
          children: [
            {
            title: 'Vendedores',
            path: '/teams/comercial/vendedores',
            },
            {
            title: 'Asistencia tecnica',
            path: '/teams/comercial/asistencia-tecnica',
            },
            {
            title: 'Administracion de Ventas',
            path: '/teams/comercial/admin-ventas',
            },
          ]
          },
          {
          title: 'Administración',
          path: '/teams/administracion',
          children: [
            {
            title: 'Pago a Proveedores',
            path: '/teams/administracion/pago-proveedores',
            },
            {
            title: 'Facturacion',
            path: '/teams/administracion/facturacion',
            },
            {
            title: 'Logistica Inversa',
            path: '/teams/administracion/logistica-inversa',
            },
            {
            title: 'Tesorería',
            path: '/teams/administracion/tesoreria',
            },
            {
            title: 'Stock',
            path: '/teams/administracion/stock',
            },
          ]
          },
      ]
    },
    {
      title: 'SF Administración',
      icon: <Settings size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin'],
      children: [
        {
          title: 'Registrar Usuario',
          path: '/admin/register-user',
          icon: <PlusCircle size={18} />
        },
        {
          title: 'Listar Usuarios',
          path: '/admin/users',
          icon: <BookUser size={18} />,
        }
      ]
    },
    {
      title: 'Acerca de',
      path: '/about',
      icon: <Info size={isCollapsed ? 20 : 18} />
    }
  ];

  // Logo SF con borde sutil
  const SFLogo = ({ className }: { className?: string }) => (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
        fill="url(#sfGradient)" 
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

  // Logo StoneFixer completo
  const StonefixerFullLogo = ({ className }: { className?: string }) => (
    <svg 
      width="200" 
      height="48" 
      viewBox="0 0 200 48" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#047857', stopOpacity:1}} />
          <stop offset="33%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="66%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="textGradientFull" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#047857', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <rect 
        width="36" 
        height="36" 
        x="6" 
        y="6" 
        rx="9" 
        fill="url(#iconGradientFull)"
      />
      <text 
        x="24" 
        y="28" 
        fontFamily="Space Grotesk, Arial" 
        fontSize="14" 
        fontWeight="800" 
        textAnchor="middle" 
        fill="white"
      >
        SF
      </text>
      <text 
        x="50" 
        y="21" 
        fontFamily="Space Grotesk, Arial" 
        fontSize="16" 
        fontWeight="800" 
        fill="url(#textGradientFull)"
      >
        StoneFixer
      </text>
      <text 
        x="50" 
        y="32" 
        fontFamily="Inter, Arial" 
        fontSize="9" 
        fill="#6b7280"
      >
        Transformando piedras en diamantes
      </text>
    </svg>
  );

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
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >

        <div className={`
          border-b border-gray-200 bg-gradient-to-r from-white to-gray-50
          ${isCollapsed ? 'p-2' : 'p-4'}
          `}>
          {isCollapsed ? (
            // Layout colapsado: logo centrado + botón abajo
            <div className="flex flex-col items-center space-y-2">
              <SFLogo className="w-10 h-10" />
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            // Layout expandido: logo + botón en fila
            <div className="flex items-center justify-between">
              <StonefixerFullLogo className="h-12" />
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>
        
        {/* Menú */}
        <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {visibleMenuItems.map(item => renderMenuItem(item))}
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
            {/* Header móvil */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
                <StonefixerFullLogo className="h-10" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Navegación móvil */}
              <div className="overflow-y-auto h-full py-4">
                {visibleMenuItems.map(item => renderMenuItem(item))}
              </div>

            
            {/* Logo */}
            {/* <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
            </div> */}
            
            {/* Menú móvil */}
            {/* <div className="overflow-y-auto h-full py-4 px-3">
              {visibleMenuItems.map(item => renderMenuItem(item))}
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default CollapsibleSidebar;