// src/components/Layout/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Home, BarChart2, Users, 
  Settings, Info, Menu, X, ChevronDown, PlusCircle, BookUser,
  Package, Laptop, ClipboardList
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
  const roles = useAuthStore(state => state.roles);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Administración: true,
    Teams: true,
    "Inventario Tecnológico": false,
    Sectores: false
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Definición de elementos del menú con iconos
  const menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      path: '/',
      icon: <Home size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin','manager', 'user']
    },
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: <BarChart2 size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'manager']
    },
    {
      title: 'Inventario Tecnológico',
      icon: <Package size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'manager', 'inventory_manager'],
      children: [
        {
          title: 'Dashboard',
          path: '/inventory/dashboard',
          icon: <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
        },
        {
          title: 'Activos Tecnológicos',
          path: '/inventory/tech-assets',
          icon: <Laptop size={16} />
        },
        {
          title: 'Asignaciones',
          path: '/inventory/assignments',
          icon: <Users size={16} />
        },
        {
          title: 'Mantenimiento',
          path: '/inventory/maintenance',
          icon: <Settings size={16} />
        },
        {
          title: 'Mis Activos',
          path: '/inventory/my-assets',
          icon: <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
        },
        {
          title: 'Reportes',
          path: '/inventory/reports',
          icon: <ClipboardList size={16} />
        }
      ]
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
      icon: <Info size={isCollapsed ? 20 : 18} />,
      requiredRoles: ['admin', 'user']
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
    // Si no tiene restricción de roles, mostrar siempre
    if (!item.requiredRoles) return true;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    if (hasAnyRole) {
      return hasAnyRole(item.requiredRoles);
    } else {
      // Fallback si hasAnyRole no está disponible
      return item.requiredRoles.some(role => roles.includes(role));
    }
  };

  // Renderizar un elemento del menú
  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!shouldShowMenuItem(item)) return null;
    
    const hasChildren = item.children && item.children.length > 0;
    const visibleChildren = hasChildren && item.children
      ? item.children.filter(shouldShowMenuItem)
      : [];
    
    // Verificar si es una ruta activa de inventario para destacar la sección
    const isInventoryActive = location.pathname.startsWith('/inventory') && item.title === 'Inventario Tecnológico';
    const isActive = location.pathname === item.path || isInventoryActive;
    const isChildActive = hasChildren && visibleChildren.some(child => 
      location.pathname === child.path || 
      (child.children && child.children.some(grandchild => location.pathname === grandchild.path))
    );
    
    const isExpanded = expandedItems[item.title] || false;
    
    // Si tiene hijos, pero ninguno visible según los roles, no mostrar
    if (hasChildren && visibleChildren.length === 0) return null;

    // Estilos especiales para el módulo de inventario
    const getItemStyles = () => {
      if (isActive || isInventoryActive || isChildActive) {
        return 'bg-emerald-50 text-emerald-600 font-medium border-r-2 border-emerald-500';
      }
      return 'text-gray-700 hover:bg-gray-100';
    };

    return (
      <div key={item.title} className="mb-1">
        {/* Elemento principal */}
        {item.path && !hasChildren ? (
          <Link 
            to={item.path}
            className={`
              flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2 rounded-md
              ${getItemStyles()}
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
              ${getItemStyles()}
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
            {visibleChildren.map(child => renderSubMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Función separada para renderizar subelementos (para manejar niveles anidados)
  const renderSubMenuItem = (item: MenuItem, level: number) => {
    if (!shouldShowMenuItem(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const visibleChildren = hasChildren && item.children
      ? item.children.filter(shouldShowMenuItem)
      : [];

    const isActive = location.pathname === item.path;
    const isChildActive = hasChildren && visibleChildren.some(child => location.pathname === child.path);

    if (hasChildren && visibleChildren.length === 0) return null;

    return (
      <div key={item.title}>
        {item.path && !hasChildren ? (
          <Link 
            to={item.path}
            className={`
              flex items-center px-3 py-2 text-sm rounded-md
              ${isActive 
                ? 'bg-emerald-50 text-emerald-600 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.title}</span>
          </Link>
        ) : (
          <>
            <button
              onClick={() => toggleExpand(item.title)}
              className={`
                flex items-center justify-between w-full px-3 py-2 text-sm rounded-md
                ${isActive || isChildActive 
                  ? 'bg-emerald-50 text-emerald-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <div className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.title}</span>
              </div>
              {hasChildren && (
                expandedItems[item.title] ? 
                <ChevronDown size={14} className="text-gray-500" /> : 
                <ChevronRight size={14} className="text-gray-500" />
              )}
            </button>
            {hasChildren && expandedItems[item.title] && (
              <div className="ml-4 mt-1 space-y-1">
                {visibleChildren.map(child => (
                  <Link 
                    key={child.title}
                    to={child.path || '#'}
                    className={`
                      flex items-center px-3 py-2 text-sm rounded-md
                      ${location.pathname === child.path 
                        ? 'bg-emerald-50 text-emerald-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    {child.icon && <span className="mr-2">{child.icon}</span>}
                    <span>{child.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
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
              <img src="/Logo-text-small.png" alt="Omnimedica" className="h-9 w-40 ml-2" />
            </div>
          )}
          {isCollapsed && (
            <img src="/Logo_Omni_O.svg" alt="OmniMedica" className="h-9 w-8 ml-5" />
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
                <img src="/Logo-text-small.png" alt="OmniMedica" className="h-8 w-8" />
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