import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import MobileLayout from './MobileLayout';

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

    // Verificar inicialmente
    checkIsMobile();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Renderizar el layout apropiado
  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <Layout>{children}</Layout>;
};

export default ResponsiveLayout;