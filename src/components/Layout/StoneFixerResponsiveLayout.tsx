import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell, LogOut, Home, BarChart2, Users, Settings, Package, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

// ================== COMPONENTE RESPONSIVELAYOUT ==================

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Detectar dispositivos móviles por ancho de pantalla y user agent
      const isMobileWidth = width < 768;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      setIsMobile(isMobileWidth || isMobileDevice);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Renderizar el layout apropiado
  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <DesktopLayout>{children}</DesktopLayout>;
};

// ================== COMPONENTE DESKTOP LAYOUT ==================

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {/* Aquí iría el StonefixerSidebar que ya creamos */}
      <StonefixerSidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <StonefixerHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 w-full">
          <div className="container mx-auto w-full h-full">
            {children}
          </div>
        </main>
        <StonefixerFooter />
      </div>
    </div>
  );
};

// ================== COMPONENTE MOBILE LAYOUT ==================

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Datos del usuario (conectar con tu store real)
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Logo SF para móvil
  const SFLogoMobile = () => (
    <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sfGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#047857', stopOpacity:1}} />
          <stop offset="33%" style={{stopColor:'#10b981', stopOpacity:1}} />
          <stop offset="66%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#sfGradientMobile)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <text x="32" y="42" fontFamily="Space Grotesk, Arial" fontSize="22" fontWeight="800" textAnchor="middle" fill="white">
        SF
      </text>
    </svg>
  );

  // Logo completo para sidebar móvil
  const StonefixerMobileLogo = () => (
    <svg width="150" height="32" viewBox="0 0 150 32" xmlns="http://www.w3.org/2000/svg">
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
      <rect width="24" height="24" x="4" y="4" rx="6" fill="url(#iconGradMobile)"/>
      <text x="16" y="20" fontFamily="Space Grotesk, Arial" fontSize="10" fontWeight="800" textAnchor="middle" fill="white">SF</text>
      <text x="36" y="16" fontFamily="Space Grotesk, Arial" fontSize="12" fontWeight="800" fill="url(#textGradMobile)">
        StoneFixer
      </text>
      <text x="36" y="24" fontFamily="Inter, Arial" fontSize="7" fill="#6b7280">
        Gestión Empresarial
      </text>
    </svg>
  );

  // Menú de navegación móvil
  const menuItems = [
    {
      title: 'Inicio',
      path: '/',
      icon: <Home size={20} />,
      requiredRoles: ['admin', 'manager', 'user']
    },
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: <BarChart2 size={20} />,
      requiredRoles: ['admin', 'manager'],
      badge: '3'
    },
    {
      title: 'Inventario Tecnológico',
      icon: <Package size={20} />,
      requiredRoles: ['admin', 'manager', 'inventory_manager'],
      children: [
        { title: 'Dashboard', path: '/inventory/business-indicators', icon: <div className="w-2 h-2 rounded-full bg-emerald-500"></div> },
        { title: 'Gestión de Activos', path: '/inventory/tech-assets', icon: <Settings size={16} /> },
        { title: 'Asignaciones', path: '/inventory/assignments', icon: <Users size={16} /> },
        { title: 'Mantenimiento', path: '/inventory/maintenance', icon: <Settings size={16} /> },
        { title: 'Mis Activos', path: '/inventory/my-assets', icon: <div className="w-2 h-2 rounded-full bg-blue-500"></div> },
        { title: 'Reportes', path: '/inventory/reports', icon: <BarChart2 size={16} /> }
      ]
    },
    {
      title: 'Sectores',
      icon: <Users size={20} />,
      requiredRoles: ['admin', 'manager'],
      children: [
        { title: 'Directorio', path: '/teams/directorio', icon: <Users size={16} /> },
        { title: 'D.A.T.', path: '/teams/dat', icon: <Settings size={16} /> }
      ]
    },
    {
      title: 'Configuración',
      path: '/settings',
      icon: <Settings size={20} />,
      requiredRoles: ['admin']
    }
  ];

  const toggleExpand = (itemTitle: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const renderMenuItem = (item: any) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title];

    return (
      <div key={item.title}>
        {!hasChildren ? (
          <button
            onClick={() => {
              console.log('Navegando a:', item.path);
              closeSidebar();
            }}
            className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 group-hover:bg-emerald-100 rounded-lg transition-colors">
                {item.icon}
              </div>
              <span className="font-medium">{item.title}</span>
            </div>
            {item.badge && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ) : (
          <div>
            <button
              onClick={() => toggleExpand(item.title)}
              className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 group-hover:bg-emerald-100 rounded-lg transition-colors">
                  {item.icon}
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
              <ChevronRight 
                size={16} 
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
              />
            </button>
            
            {isExpanded && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-emerald-100 pl-4">
                {item.children.map((child: any) => (
                  <button
                    key={child.title}
                    onClick={() => {
                      console.log('Navegando a:', child.path);
                      closeSidebar();
                    }}
                    className="flex items-center space-x-3 w-full p-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                  >
                    {child.icon}
                    <span>{child.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil con nuevo branding */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-emerald-600 text-white sticky top-0 z-40 shadow-xl">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y botón de menú */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Menu size={20} />
              </button>
              <SFLogoMobile />
              <div>
                <div className="font-bold text-lg">StoneFixer</div>
                <div className="text-xs text-gray-300">Gestión Empresarial</div>
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsSearchFocused(!isSearchFocused)}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Search size={18} />
              </button>
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Barra de búsqueda expandible */}
          {isSearchFocused && (
            <div className="mt-3 animate-in slide-in-from-top duration-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar problemas, soluciones, reportes..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200"
                  autoFocus
                />
                <button 
                  onClick={() => setIsSearchFocused(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar overlay para móvil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeSidebar}
          />
          
          {/* Panel del sidebar */}
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
                    {user.full_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            )}
            
            {/* Menú de navegación */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
              <div className="space-y-2">
                {menuItems.map(item => renderMenuItem(item))}
              </div>
            </div>

            {/* Footer del sidebar móvil */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={18} />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
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

// ================== COMPONENTES AUXILIARES ==================

// Sidebar para desktop (referencia al que ya creamos)
const StonefixerSidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="text-lg font-bold text-gray-800">StoneFixer Sidebar</div>
        <div className="text-sm text-gray-500">Usar el componente StonefixerSidebar que ya creamos</div>
      </div>
    </div>
  );
};

// Header para desktop
const StonefixerHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">StoneFixer Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

// Footer para desktop
const StonefixerFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>© 2024 StoneFixer by Omnimedica</span>
        <span>Transformando problemas en soluciones</span>
      </div>
    </footer>
  );
};

export default ResponsiveLayout;