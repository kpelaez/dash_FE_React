/**
 * ============================================
 * COMPONENTE: Header
 * ============================================
 * 
 * ¿POR QUÉ ESTE COMPONENTE?
 * 1. CONTEXTO: Muestra dónde está el usuario (breadcrumb/título)
 * 2. ACCIONES: Notificaciones, búsqueda, perfil
 * 3. RESPONSIVE: Se adapta a mobile/tablet/desktop
 * 4. CONSISTENTE: Mismo header en todas las vistas
 * 
 * CARACTERÍSTICAS:
 * - Sticky en scroll (siempre visible)
 * - User menu dropdown
 * - Notificaciones badge
 * - Search bar (opcional, implementar después)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  // Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { findMenuItemByPath, menuItems } from '../../config/menuConfig';

interface HeaderProps {
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = ''}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // OBTENER TÍTULO DE LA PÁGINA ACTUAL
  /**
   * ¿POR QUÉ ESTO?
   * - Automáticamente muestra el título correcto según la ruta
   * - No necesitas definir títulos manualmente en cada página
   * - Single source of truth (menuConfig)
   */
  const currentMenuItem = findMenuItemByPath(menuItems, location.pathname);
  const pageTitle = currentMenuItem?.title || 'StoneFixer';

  // CERRAR MENÚ AL HACER CLIC FUERA
  
  /**
   * ¿POR QUÉ useEffect + addEventListener?
   * - Patrón estándar para "click outside"
   * - Mejora UX: menú se cierra naturalmente
   * - Accesibilidad: comportamiento esperado
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };

    if (isUserMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  // HANDLERS

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // ==========================================
  // OBTENER INICIALES DEL USUARIO
  // ==========================================
  
  /**
   * Para el avatar circular con iniciales
   */
  const getUserInitials = () => {
    if (!user?.full_name) return 'U';
    
    return user.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ==========================================
  // RENDER: SEARCH BAR
  // ==========================================
  
  // const renderSearchBar = () => (
  //   <div className="
  //     hidden md:flex
  //     items-center
  //     max-w-md w-full
  //     bg-gray-100 rounded-lg
  //     px-4 py-2
  //     transition-all
  //     focus-within:bg-white
  //     focus-within:ring-2
  //     focus-within:ring-emerald-500
  //     focus-within:ring-opacity-50
  //   ">
  //     <Search size={18} className="text-gray-400 mr-2" />
  //     <input
  //       type="text"
  //       placeholder="Buscar..."
  //       className="
  //         w-full
  //         bg-transparent
  //         outline-none
  //         text-sm
  //         text-gray-700
  //         placeholder-gray-400
  //       "
  //       disabled // Habilitar cuando implementes búsqueda
  //     />
  //   </div>
  // );

  /**
   * NOTA: Search bar y notificaciones comentados temporalmente
   * hasta que se implemente la funcionalidad real.
   * 
   * Para habilitar:
   * 1. Descomentar las funciones renderSearchBar() y renderNotifications()
   * 2. Agregar las funciones en el return principal
   */


  // ==========================================
  // RENDER: USER MENU
  // ==========================================
  
  /**
   * ¿POR QUÉ UN DROPDOWN?
   * - Espacio limitado en header
   * - Acciones secundarias (perfil, ajustes, logout)
   * - Patrón UI estándar
   */
  const renderUserMenu = () => (
    <div className="relative" ref={userMenuRef}>
      {/* Botón trigger */}
      <button
        type="button"
        onClick={toggleUserMenu}
        className="
          flex items-center space-x-3
          px-3 py-2 rounded-lg
          hover:bg-gray-100
          transition-colors
        "
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="
          w-8 h-8
          rounded-full
          bg-gradient-to-br from-emerald-500 to-emerald-600
          text-white
          flex items-center justify-center
          text-sm font-bold
        ">
          {getUserInitials()}
        </div>
        
        {/* Nombre (oculto en móvil) */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.full_name || 'Usuario'}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email}
          </p>
        </div>
        
        {/* Chevron */}
        <ChevronDown 
          size={16} 
          className={`
            hidden md:block
            text-gray-400
            transition-transform
            ${isUserMenuOpen ? 'rotate-180' : ''}
          `}
        />
      </button>
      
      {/* Dropdown */}
      {isUserMenuOpen && (
        <div className="
          absolute right-0 top-full mt-2
          w-64
          bg-white rounded-lg shadow-lg
          border border-gray-200
          py-2
          z-50
          animate-in slide-in-from-top-2 fade-in duration-200
        ">
          {/* User info (móvil) */}
          <div className="md:hidden px-4 py-3 border-b border-gray-200">
            <p className="font-medium text-gray-900">
              {user?.full_name || 'Usuario'}
            </p>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>
          
          {/* Menu items */}
          <button
            type="button"
            onClick={() => {
              navigate('/profile');
              setIsUserMenuOpen(false);
            }}
            className="
              w-full
              flex items-center space-x-3
              px-4 py-3
              hover:bg-gray-50
              transition-colors
              text-left
            "
            disabled // Habilitar cuando tengas página de perfil
          >
            <User size={18} className="text-gray-400" />
            <span className="text-sm text-gray-700">Mi Perfil</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              navigate('/settings');
              setIsUserMenuOpen(false);
            }}
            className="
              w-full
              flex items-center space-x-3
              px-4 py-3
              hover:bg-gray-50
              transition-colors
              text-left
            "
            disabled // Habilitar cuando tengas página de ajustes
          >
            <Settings size={18} className="text-gray-400" />
            <span className="text-sm text-gray-700">Ajustes</span>
          </button>
          
          <div className="border-t border-gray-200 my-2" />
          
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex items-center space-x-3
              px-4 py-3
              hover:bg-red-50
              transition-colors
              text-left
            "
          >
            <LogOut size={18} className="text-red-500" />
            <span className="text-sm text-red-600 font-medium">
              Cerrar Sesión
            </span>
          </button>
        </div>
      )}
    </div>
  );

  // ==========================================
  // RENDER PRINCIPAL
  // ==========================================
  
  /**
   * ESTRATEGIA RESPONSIVE:
   * - Mobile: Solo título y user menu
   * - Tablet+: Título, search, notificaciones, user menu
   * - Sticky: Siempre visible al hacer scroll
   * - z-30: Debajo del sidebar (z-40) pero sobre contenido
   */
  
  return (
    <header className={`
      ${className}
      sticky top-0 z-30
      bg-white border-b border-gray-200
      shadow-sm
      px-4 md:px-6 py-4
      transition-all duration-200
    `}>
      <div className="flex items-center justify-between">
        {/* Título de la página */}
        <div className="flex items-center space-x-4">
          <h1 className="
            text-lg md:text-xl
            font-semibold text-gray-900
            truncate
          ">
            {pageTitle}
          </h1>
        </div>
        
        {/* Search bar (solo desktop) */}
        {/* {renderSearchBar()} */}

        {/* Acciones */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {renderUserMenu()}
        </div>
      </div>
    </header>
  );
};

export default Header;




