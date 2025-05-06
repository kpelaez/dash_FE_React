import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Users, PlusCircle } from 'lucide-react';

interface MenuItems {
    title: string;
    path?: string;
    icon?: ReactNode;
    children?: MenuItems[];
}

// Datos del Menu
const menuItems: MenuItems[] = [
    {
      title: 'Inicio',
      path: '/',
    },
    {
      title: 'Dashboards',
      path:'/dashboards',
    },
    {
      title: 'Teams',
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
      title: 'Acerca de',
      path: '/about'
    },
    {
      title: 'Administración',
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
    }
]

const Sidebar = () => {
  const location = useLocation();
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

  // Renderizar un elemento del menu
  const renderMenuItem = (item: MenuItems, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.path;
    const isExpanded = expandedItems[item.title] || false;

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
            ${isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}
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
            text-gray-700 hover:bg-gray-100
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
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" 
            />
          </svg>
        </div>
      </div>
      
      {/* Menú */}
      <div className="flex-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
}

export default Sidebar