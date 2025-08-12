// src/hooks/useMobile.ts
import { useState, useEffect } from 'react';
import { 
  getExtendedNavigator, 
  getExtendedWindow, 
  hasNavigatorCapability, 
  hasWindowCapability 
} from '../types/mobile.types';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  touchDevice: boolean;
}

export const useMobile = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'portrait',
    screenSize: 'lg',
    touchDevice: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;

      // Detectar dispositivo táctil
      const touchDevice = 'ontouchstart' in window || 
                         navigator.maxTouchPoints > 0 || 
                         (navigator as any).msMaxTouchPoints > 0;

      // Detectar orientación
      const orientation = height > width ? 'portrait' : 'landscape';

      // Detectar tamaño de pantalla
      let screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
      if (width < 480) screenSize = 'xs';
      else if (width < 640) screenSize = 'sm';
      else if (width < 768) screenSize = 'md';
      else if (width < 1024) screenSize = 'lg';
      else screenSize = 'xl';

      // Detectar tipo de dispositivo
      const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isMobileWidth = width < 768;
      const isTabletWidth = width >= 768 && width < 1024;

      const isMobile = (isMobileAgent && width < 768) || isMobileWidth;
      const isTablet = (isMobileAgent && isTabletWidth) || (touchDevice && isTabletWidth);
      const isDesktop = !isMobile && !isTablet;

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenSize,
        touchDevice,
      });
    };

    // Detectar inicialmente
    detectDevice();

    // Escuchar cambios
    const handleResize = () => {
      detectDevice();
    };

    const handleOrientationChange = () => {
      // Delay para asegurar que las dimensiones se hayan actualizado
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return detection;
};

// Hook adicional para gestionar el viewport móvil
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Hook para gestionar el estado del teclado virtual en móvil
export const useVirtualKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // Si la altura se reduce significativamente, probablemente el teclado está abierto
      if (heightDifference > 150) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(heightDifference);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    const handleVisualViewportChange = () => {
      if (hasWindowCapability('visualViewport')) {
        const extendedWindow = getExtendedWindow();
        const viewport = extendedWindow.visualViewport!;
        const heightDifference = window.innerHeight - viewport.height;
        
        if (heightDifference > 150) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(heightDifference);
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    // API más precisa para detectar teclado virtual (si está disponible)
    if (hasWindowCapability('visualViewport')) {
      const extendedWindow = getExtendedWindow();
      extendedWindow.visualViewport!.addEventListener('resize', handleVisualViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (hasWindowCapability('visualViewport')) {
        const extendedWindow = getExtendedWindow();
        extendedWindow.visualViewport!.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};

// Hook para gestionar el comportamiento de scroll en móvil
export const useScrollBehavior = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
        setIsScrollingDown(direction === 'down');
      }
      
      setScrollY(scrollY);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDirection]);

  return { scrollDirection, scrollY, isScrollingDown };
};

// Hook para gestionar gestos táctiles básicos
export const useTouch = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    return {
      isLeftSwipe,
      isRightSwipe,
      isUpSwipe,
      isDownSwipe,
      distanceX,
      distanceY,
    };
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    touchStart,
    touchEnd,
  };
};

// Hook para optimizar el rendimiento en móvil
export const useMobilePerformance = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Detectar dispositivos de bajo rendimiento
    const checkPerformance = () => {
      const extendedNavigator = getExtendedNavigator();
      
      // Verificar conexión de red
      if (hasNavigatorCapability('connection') && extendedNavigator.connection) {
        const connection = extendedNavigator.connection;
        setConnectionType(connection.effectiveType || 'unknown');
        
        // Considerar bajo rendimiento si la conexión es lenta
        const slowConnections = ['slow-2g', '2g', '3g'];
        if (connection.effectiveType && slowConnections.includes(connection.effectiveType)) {
          setIsLowPerformance(true);
        }
      }

      // Verificar memoria del dispositivo
      if (hasNavigatorCapability('deviceMemory') && extendedNavigator.deviceMemory) {
        const deviceMemory = extendedNavigator.deviceMemory;
        if (deviceMemory < 4) {
          setIsLowPerformance(true);
        }
      }

      // Verificar número de núcleos del procesador
      if (hasNavigatorCapability('hardwareConcurrency') && extendedNavigator.hardwareConcurrency) {
        const cores = extendedNavigator.hardwareConcurrency;
        if (cores < 4) {
          setIsLowPerformance(true);
        }
      }
    };

    checkPerformance();
  }, []);

  return { isLowPerformance, connectionType };
};

export default useMobile;