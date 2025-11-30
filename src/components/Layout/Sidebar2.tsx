/**
 * ============================================
 * COMPONENTE: Sidebar
 * ============================================
 * 
 * ¿POR QUÉ ESTE DISEÑO?
 * 1. MOBILE-FIRST: Empezamos diseñando para móvil, luego escalamos
 * 2. CSS-BASED RESPONSIVE: Usamos breakpoints, NO detección de dispositivos
 * 3. SINGLE COMPONENT: Una implementación con variantes, no múltiples componentes
 * 4. ACCESIBILIDAD: ARIA, keyboard nav, focus trap en móvil
 * 
 * COMPORTAMIENTO:
 * - Mobile (<768px): Drawer desde la izquierda, overlay backdrop
 * - Tablet/Desktop (≥768px): Sidebar fijo, colapsable
 * - Animaciones suaves con Tailwind
 * - Safe areas para iOS (notch)
 */

import React, { useEffect } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import MenuItem from './MenuItem';
import { useMenu, useSidebarState } from '../../hooks/useMenu';


// LOGO COMPONENTS

/**
 * ¿POR QUÉ COMPONENTES DE LOGO SEPARADOS?
 * - Reutilizables en Header, Login, etc.
 * - SVG inline = no hay request HTTP extra
 * - Gradientes personalizados = marca visual fuerte
 */

const SFLogoIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
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
      fontFamily="Space Grotesk, system-ui, Arial" 
      fontSize="22" 
      fontWeight="800" 
      textAnchor="middle" 
      fill="white"
    >
      SF
    </text>
  </svg>
);

const StonefixerFullLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <SFLogoIcon size={40} />
    <div className="flex flex-col">
      <span className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-blue-600 bg-clip-text text-transparent">
        StoneFixer
      </span>
      <span className="text-xs text-gray-500">
        by OmniMedica
      </span>
    </div>
  </div>
);


interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({className = ''}) => {
  const {
    visibleMenuItems,
    expandedItems,
    toggleExpand,
    isActive
  } = useMenu();


  const {
    isCollapsed,
    isMobileMenuOpen,
    toggleCollapse,
    toggleMobileMenu,
    closeMobileMenu
  } = useSidebarState();

  // EFECTOS
  
  /**
   * ¿POR QUÉ ESTE EFECTO?
   * - Prevenir scroll del body cuando el menú móvil está abierto
   * - Importante para UX: el contenido detrás no debe scrollear
   * - Cleanup automático cuando se desmonta o cierra
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  /**
   * ¿POR QUÉ ESTE EFECTO?
   * - Cerrar menú móvil cuando cambia a desktop
   * - Evita que quede abierto el drawer en pantallas grandes
   * - matchMedia es más confiable que resize events
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  /**
   * Cerrar sidebar al cambiar de ruta en mobile
   */
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) {  // ✅ Cambiado de 768 a 1024
        closeMobileMenu();
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [closeMobileMenu]);

  /**
   * Prevenir scroll del body cuando el mobile menu está abierto
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);


  // HANDLRES

  /**
   * Cerrar menú móvil cuando se hace clic en un item
   * Mejora la UX: después de navegar, el drawer se cierra automáticamente
   */
 const handleMenuItemClick = () => {
    if (window.innerWidth < 1024) {  // ✅ Cambiado de 768 a 1024
      closeMobileMenu();
    }

    window.addEventListener('popstate', handleMenuItemClick);
    return () => window.removeEventListener('popstate', handleMenuItemClick);
  };

  // RENDER: BOTÓN MÓVIL (HAMBURGER)
  
  /**
   * ¿POR QUÉ FIXED + Z-50?
   * - Siempre visible, incluso con scroll
   * - z-50 asegura que esté sobre el contenido
   * - iOS safe-area considerado con pt-safe
   */
  const renderMobileButton = () => (
    <button
      type="button"
      onClick={toggleMobileMenu}
      className="
        fixed top-3 left-3 z-50
        lg:hidden
        p-2.5 rounded-lg
        bg-white shadow-lg
        text-gray-700 hover:bg-emerald-50
        transition-colors
        border border-gray-200
      "
      aria-label="Abrir menú"
    >
      <Menu size={22} />
    </button>
  );

  // RENDER: BACKDROP MÓVIL
  
  /**
   * ¿POR QUÉ UN BACKDROP?
   * - Indica visualmente que hay un modal/drawer abierto
   * - Permite cerrar haciendo clic fuera
   * - Accessibility: focus trap visual
   */
  const renderMobileBackdrop = () => {
    isMobileMenuOpen && (
      <div
        className="
          fixed inset-0 z-30
          bg-black/50
          lg:hidden
          transition-opacity duration-300
        "
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
    );
  };

  // RENDER: CONTENIDO DEL SIDEBAR
  /**
   * ¿POR QUÉ ESTA ESTRUCTURA?
   * - Header: Logo y controles
   * - Content: Menú scrolleable
   * - Footer: Info adicional (estado, versión, etc.)
   * 
   * La estructura es la misma para mobile y desktop,
   * solo cambian los estilos responsivos
   */
  const renderSidebarContent = () => (
    <>
      {/* HEADER */}
      <div className={`
        flex-shrink-0
        ${isCollapsed ? 'p-4' : 'p-6'}
        border-b border-gray-200
        bg-white
      `}>
        {!isCollapsed ? (
          <>
            <StonefixerFullLogo />
            
            {/* Botón collapse (solo desktop) */}
            <button
              type="button"
              onClick={toggleCollapse}
              className="
                hidden lg:flex
                p-2 rounded-lg
                text-gray-500 hover:bg-gray-100
                transition-colors
                mt-4
              "
              aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Botón cerrar (solo móvil/tablet) */}
            <button
              type="button"
              onClick={closeMobileMenu}
              className="
                lg:hidden
                absolute top-6 right-6
                p-2 rounded-lg
                text-gray-500 hover:bg-gray-100
                transition-colors
              "
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          // Modo colapsado: solo icono y botón expandir
          <div className="flex flex-col items-center w-full">
            <SFLogoIcon size={32} />
            <button
              type="button"
              onClick={toggleCollapse}
              className="
                mt-2 p-1.5 rounded-lg
                text-gray-500 hover:bg-gray-100
                transition-colors
              "
              aria-label="Expandir sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* CONTENT (Menú) */}
      <nav 
        className="
          flex-1 overflow-y-auto
          py-4
          custom-scrollbar
        "
        aria-label="Navegación principal"
      >
        <div className="space-y-1 px-2">
          {visibleMenuItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              isExpanded={expandedItems[item.id]}
              isActive={isActive(item)}
              onToggle={toggleExpand}
              onClick={handleMenuItemClick}
              variant={isCollapsed ? 'collapsed' : 'default'}
            />
          ))}
        </div>
      </nav>
      
      {/* FOOTER */}
      <div className={`
        flex-shrink-0
        ${isCollapsed ? 'p-2' : 'p-4'}
        border-t border-gray-200
        bg-emerald-50
      `}>
        {isCollapsed ? (
          <div 
            className="w-3 h-3 bg-emerald-500 rounded-full mx-auto animate-pulse" 
            title="Sistema operativo"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-700 font-medium">
              Sistema operativo
            </span>
          </div>
        )}
      </div>
    </>
  );

  // ==========================================
  // RENDER PRINCIPAL
  // ==========================================
  
  /**
   * ESTRATEGIA RESPONSIVE:
   * 
   * MOBILE (<768px):
   * - Sidebar está fuera de pantalla (translate-x)
   * - Se anima desde la izquierda cuando isMobileMenuOpen
   * - Fixed position con z-40
   * - Width: 80% max 320px (para que se vea contenido detrás)
   * 
   * TABLET/DESKTOP (≥768px):
   * - Siempre visible
   * - Sticky position para scroll independiente
   * - Width: colapsado 80px, expandido 280px
   * - Transición suave entre estados
   */
  
  return (
    <>
      {/* Botón hamburger (móvil) */}
      {renderMobileButton()}
      
      {/* Backdrop (móvil) */}
      {renderMobileBackdrop()}
      
      {/* SIDEBAR */}
      <aside
        className={`
          ${className}
          
          /* MOBILE: Drawer desde la izquierda */
          fixed md:sticky
          top-0 left-0
          h-screen
          z-40
          
          /* Transiciones suaves */
          transition-all duration-300 ease-out
          
          /* Width responsive */
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-[85vw] max-w-[320px]
          ${isCollapsed ? 'lg:w-20' : 'lg:w-[280px]'}
          
          /* Estilos visuales */
          bg-white
          border-r border-gray-200
          shadow-2xl lg:shadow-none
          
          /* Layout interno */
          flex flex-col
          overflow-hidden
          
          /* iOS safe areas */
          safe-area-inset-left
        `}
        aria-label="Sidebar"
      >
        {renderSidebarContent()}
      </aside>
      
      {/* CUSTOM SCROLLBAR STYLES */}
      <style>{`
        /* 
          ¿POR QUÉ ESTILOS INLINE?
          - Tailwind no tiene utilidades para scrollbar
          - Específico a este componente
          - Pequeño, no justifica un archivo CSS separado
        */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
        
        /* 
          iOS SAFE AREAS
          ¿POR QUÉ?
          - iPhone X+ tienen notch y home indicator
          - env() respeta estas áreas
          - Fallback a 0 en dispositivos sin notch
        */
        .safe-area-inset-left {
          padding-left: env(safe-area-inset-left, 0);
        }
      `}</style>
    </>
  );
};

export default Sidebar;