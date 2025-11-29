/**
 * HOOK: useMenu
 * 
 * ¿POR QUÉ UN HOOK PERSONALIZADO?
 * 1. Separa la LÓGICA de la PRESENTACIÓN
 * 2. Reutilizable en cualquier componente que necesite el menú
 * 3. Testeable independientemente
 * 4. Mantiene los componentes limpios y enfocados en UI
 * 
 * RESPONSABILIDADES:
 * - Filtrar items según roles del usuario
 * - Manejar estado de expansión de submenús
 * - Determinar items activos basado en la ruta
 * - Proveer funciones para manipular el menú
 */

import { useState, useMemo, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { useAuthStore } from "../stores/authStore";
import {
  menuItems,
  filterMenuByRoles,
  isPathActive,
  MenuItem,
  UserRole
} from '../config/menuConfig'

// TIPOS
interface UseMenuReturn {
  visibleMenuItems: MenuItem[];
  expandedItems: Record<string, boolean>;
  toggleExpand: (itemId: string) => void;
  expand: (itemId: string) => void;
  collapse: (ItemId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isActive: (item: MenuItem) => boolean;
  currentPath: string;
}

// HOOK PRINCIPAL

/**
 * Hook para manejar la lógica del menú
 * 
 * VENTAJAS:
 * - Automáticamente filtra por roles
 * - Maneja estado de expansión persistente
 * - Detecta ruta activa automáticamente
 * - Performance optimizado con useMemo/useCallback
 */

export const useMenu = (): UseMenuReturn => {
  const location = useLocation();
  const roles = useAuthStore(state => state.roles) as UserRole[];

    
  // ESTADO
  
  /**
   * ¿POR QUÉ useState PARA EXPANDED ITEMS?
   * - Necesitamos mantener estado local del UI
   * - No es data del servidor, es preferencia del usuario
   * - Podríamos persistirlo en localStorage más adelante
   */
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    // Inicializar algunos items expandidos por defectos
    'sectors': true,
    'tech-inventory': true
  });

  // MEMOIZACIÓN

  /**
   * ¿POR QUÉ useMemo?
   * - filterMenuByRoles es una operación costosa (recorre todo el árbol)
   * - Solo necesitamos recalcular cuando cambien los roles
   * - Evita re-renders innecesarios en componentes hijos
   * 
   * PERFORMANCE: De O(n) en cada render a O(n) solo cuando cambien roles
   */
  const visibleMenuItems = useMemo(()=> {
    return filterMenuByRoles(menuItems, roles);
  }, [roles]);

  // CALLBACKS
  
  /**
   * ¿POR QUÉ useCallback?
   * - Estas funciones se pasan como props a componentes hijos
   * - Sin useCallback, se crean nuevas instancias en cada render
   * - Esto causaría re-renders innecesarios de los hijos
   * - React.memo de los componentes hijos funciona mejor con callbacks estables
   */

  const toggleExpand = useCallback((itemId: string) => {
    setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
    }));
  }, []);

  const expand = useCallback((itemId: string) => {
    setExpandedItems(prev => ({
        ...prev,
        [itemId]: true
    }));
  },[]);

  const collapse = useCallback((itemId: string) => {
    setExpandedItems(prev => ({
        ...prev,
        [itemId]: false
    }));
  }, []);

  const expandAll = useCallback(() => {
    const allIds: Record<string, boolean> = {};

    const collectIds = (items: MenuItem[]) => {
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                allIds[item.id] = true;
                collectIds(item.children);
            }
        });
    };

    collectIds(visibleMenuItems);
    setExpandedItems(allIds);
  }, [visibleMenuItems]);

  const collapseAll = useCallback(()=> {
    setExpandedItems({})
  }, []);

  const isActive = useCallback((item: MenuItem) => {
    return isPathActive(item, location.pathname);
  }, [location.pathname]);

  return {
    visibleMenuItems,
    expandedItems,
    toggleExpand,
    expand,
    collapse,
    expandAll,
    collapseAll,
    isActive,
    currentPath: location.pathname
  };
};

// HOOK AUXILIAR: useSidebarState

interface UseSidebarStateReturn {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleCollapse: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
}

/**
 * Hook para manejar el estado del sidebar (colapsado/expandido, móvil abierto/cerrado)
 * 
 * ¿POR QUÉ SEPARAR ESTE HOOK?
 * - useMenu maneja la LÓGICA del menú
 * - useSidebarState maneja el ESTADO del UI del sidebar
 * - Separación de responsabilidades (Single Responsibility Principle)
 * - Puedes usar uno sin el otro si es necesario
 */
export const useSidebarState = (): UseSidebarStateReturn => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleCollapse = useCallback(()=> {
    setIsCollapsed(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(()=> {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
  
  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);
    
  return {
    isCollapsed,
    isMobileMenuOpen,
    toggleCollapse,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu
  };
};
