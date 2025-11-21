import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Home, BarChart2, Users, 
  Settings, Menu, X, ChevronDown, Package, Laptop, 
  ClipboardList, FileText,
  PlusCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface MenuItems {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItems[];
  requiredRoles?: string[];
  badge?: string;
}

// Datos del Menu
const menuItems: MenuItems[] = [
    {
      title: 'Inicio',
      requiredRoles: ['admin','manager', 'user'],
      path: '/',
    },
    {
      title: 'Indicadores',
      requiredRoles: ['admin', 'manager',],
      path:'/business-indicators',
    },
    {
      title: 'Sectores',
      requiredRoles: ['admin', 'manager',],
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
      requiredRoles: ['admin'],
      icon: <Users size={18} />,
      children: [
        {
          title: 'Registrar Usuario',
          path: '/admin/register-user',
          icon: <PlusCircle size={18} />
        },
        {
          title: 'Listar Usuarios',
          path: '/admin/users',
          icon: <Users size={18} />
        }
      ]
    },
    {
      title: 'Acerca de',
      requiredRoles: ['admin', 'user'],
      path: '/about'
    },
]
const StonefixerSidebar = () => {
  const location = useLocation();
  const { hasAnyRole } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Inventario Tecnológico': false,
    'Sectores': false,
    'Administracion': false,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        Transformando problemas en soluciones
      </text>
    </svg>
  );

  const shouldShowMenuItem = (item: MenuItems): boolean => {
    // Si no tiene restricción de roles, mostrar siempre
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
     // Verificar si el usuario tiene alguno de los roles requeridos
    return hasAnyRole(item.requiredRoles);
  };

   const handleNavigation = (path: string) => {
    // En implementación real, usar navigate(path)
    console.log('Navegando a:', path);
  };

  const toggleExpand = (itemTitle: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const renderMenuItem = (item: MenuItems, level: number = 0) => {
    //No mostrar si el usuario no tiene los roles requeridos
    if (!shouldShowMenuItem(item)) return null;

    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title];
    const visibleChildren = hasChildren ? item.children!.filter(shouldShowMenuItem) : [];

    return (
      <div key={item.title} className={level === 0 ? 'mb-1' : ''}>
        {/* Elemento principal */}
        {item.path && !hasChildren ? (
          <Link 
            to={item.path}
            className={`
              flex items-center w-full ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 rounded-lg
              ${isActive 
                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 font-semibold border-r-4 border-emerald-500' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
              transition-all duration-200 group relative
              ${isCollapsed ? 'mx-2' : 'mx-3'}
            `}
            title={isCollapsed ? item.title : ''}
          >
            <div className="flex items-center">
              <span className={`flex-shrink-0 ${isActive ? 'text-emerald-600' : ''}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="ml-3 font-medium">{item.title}</span>}
            </div>
            </Link>
            ) : (
            <button>
            {!isCollapsed && hasChildren && (
              <ChevronRight 
                size={16} 
                className={`text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            )}
            
            {/* Tooltip para sidebar colapsado */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                {item.title}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </button>
        )}
        
        {/* Subelementos */}
        {hasChildren && isExpanded && !isCollapsed && visibleChildren.length > 0 && (
          <div className="ml-6 mr-3 mt-1 space-y-1 border-l-2 border-emerald-100 pl-4">
            {visibleChildren.map(child => (
              <button 
                key={child.title}
                onClick={() => child.path && handleNavigation(child.path)}
                className={`
                  flex items-center w-full px-3 py-2 text-sm rounded-lg
                  ${location.pathname === child.path 
                    ? 'bg-emerald-50 text-emerald-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  transition-colors duration-150
                `}
              >
                <span className="mr-3">{child.icon}</span>
                {child.title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const visibleMenuItems = menuItems.filter(shouldShowMenuItem);

  return (
    <>
      {/* Sidebar para desktop */}
      <div 
        className={`
          hidden md:flex flex-col h-screen bg-white border-r border-gray-200 shadow-lg
          transition-all duration-300 ease-in-out relative
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header con logo */}
        <div className={`
          flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} 
          p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50
        `}>
          {/* Logo con transición suave */}
          <div className="transition-all duration-300 overflow-hidden">
            {isCollapsed ? (
              <SFLogo className="w-12 h-12" />
            ) : (
              <StonefixerFullLogo className="h-12" />
            )}
          </div>
          
          {/* Botón de colapso */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700
              transition-all duration-200 group
              ${isCollapsed ? 'absolute -right-3 top-4 bg-white border border-gray-200 shadow-md z-10' : ''}
            `}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            
            {/* Tooltip para botón de colapso */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Expandir menú
              </div>
            )}
          </button>
        </div>
        
        {/* Navegación */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {visibleMenuItems.map(item => renderMenuItem(item))}
        </div>


        {/* Indicador de estado del sistema */}
        <div className={`
          ${isCollapsed ? 'p-2' : 'p-4'} 
          border-t border-gray-200 bg-emerald-50
        `}>
          {isCollapsed ? (
            <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto animate-pulse" title="Sistema operativo"></div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-700 font-medium">Sistema operativo</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón para menú móvil */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl bg-white shadow-lg text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar para móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Panel móvil */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl transform transition-transform duration-300 ease-out">
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
          </div>
        </div>
      )}

      {/* Estilos CSS personalizados */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default StonefixerSidebar;