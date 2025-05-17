import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Users, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface MenuItems {
    title: string;
    path?: string;
    icon?: ReactNode;
    children?: MenuItems[];
    requiredRoles?: string[];
}

// Datos del Menu
const menuItems: MenuItems[] = [
    {
      title: 'Inicio',
      requiredRoles: ['admin','manager', 'user'],
      path: '/',
    },
    {
      title: 'Dashboards',
      requiredRoles: ['admin', 'manager',],
      path:'/dashboards',
    },
    {
      title: 'Teams',
      requiredRoles: ['admin', 'manager',],
      children: [
          {
          title: 'Desarrollo',
          path: '/teams/desarrollo',
          },
          {
          title: 'Recursos Humanos',
          path: '/teams/RRHH',
          },
          {
          title: 'Comercio Exterior',
          path: '/teams/comex',
          },
          {
          title: 'Ventas',
          path: '/teams/ventas',
          }
      ]
    },
    {
      title: 'Administración',
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

const Sidebar = () => {
  const location = useLocation();
  const hasAnyRole = useAuthStore(state => state.hasAnyRole);
  const roles = useAuthStore(state=>state.roles)

  // Para depuración
  console.log("Roles actuales en Sidebar:", roles);
  

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Teams: false, //Para iniciar expandido, se puede omitir
    Administracion: false,
  });

  //Funcion para alternar la expansion
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
        ...prev,
        [title]: !prev[title],
    }));
  };

  // Función para determinar si una opción del menú debe mostrarse según el rol
  const shouldShowMenuItem = (item: MenuItems): boolean => {
    // Si no tiene restricción de roles, mostrar siempre
    if (!item.requiredRoles) return true;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    // IMPORTANTE: Asegúrate de que esta lógica esté funcionando correctamente
    if (hasAnyRole) {
      return hasAnyRole(item.requiredRoles);
    } else {
      // Fallback si hasAnyRole no está disponible
      return item.requiredRoles.some(role => roles.includes(role));
    }
  };

  // Renderizar un elemento del menu
  const renderMenuItem = (item: MenuItems, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.path;
    const isExpanded = expandedItems[item.title] || false;

    // Para depuracion
    console.log("MenuItem:", item.title, "requiredRoles:", item.requiredRoles, "Should show:", shouldShowMenuItem(item));


    //No mostrar si el usuario no tiene los roles requeridos
    if(!shouldShowMenuItem(item)) return null;

    // Si tiene hijos, verificar si al menos uno debe mostrarse
    if(item.children && item.children.length > 0) {
      const visibleChildren = item.children.filter(shouldShowMenuItem);
      if (visibleChildren.length === 0) return null;
      
      // Actualizar children con solo los visibles
      item = {... item, children: visibleChildren};
    }


    // Estilos basados en el nivel 
    const paddingLeft = level === 0 ? 'pl-4': `pl-${4 + level * 6}`;
    return (
      <div key={item.title}>
        {/* Elemento principal */}
        {item.path && !hasChildren ? (
        <Link 
            to={item.path}
            className={`
            flex items-center ${paddingLeft} py-3 pr-4 
            ${isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-700 hover:bg-gray-200'}
            transition-colors duration-150
            `}
        >
            {item.title}
        </Link>
        ) : (
        <button
            onClick={() => toggleExpand(item.title)}
            className={`
            flex items-center justify-between w-full ${paddingLeft} py-3 pr-4 
            text-emerald-800 font-medium hover:bg-gray-200
            transition-colors duration-150
            `}
        >
            <span>{item.title}</span>
            {hasChildren && (
            isExpanded ? 
            <ChevronDown size={18} className="text-gray-500" /> : 
            <ChevronRight size={18} className="text-gray-500" />
            )}
        </button>
        )}
        
        {/* Subelementos */}
        {hasChildren && isExpanded && (
        <div className="ml-2">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
        </div>
        )}
      </div>
    );
  }

  const visibleMenuItems = menuItems.filter(shouldShowMenuItem);
  return (
    <div className="w-55 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="h-9 flex items-center justify-center">
          <a href='/'><img src="/Logo-text-small.png" alt="logo empresa diminutivo" className="h-14" /></a>
        </div>
      </div>
      
      {/* Menú */}
      <div className="flex-1 overflow-y-auto">
        {visibleMenuItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
}

export default Sidebar