// src/types/mobile.types.ts
export interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface ExtendedNavigator {
  deviceMemory?: number;
  connection?: NetworkInformation;
  hardwareConcurrency?: number;
}

export interface VisualViewport {
  height: number;
  width: number;
  offsetTop: number;
  offsetLeft: number;
  pageTop: number;
  pageLeft: number;
  scale: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

export interface ExtendedWindow {
  visualViewport?: VisualViewport;
}

// Función helper para verificar si el navegador tiene ciertas capacidades
export const hasNavigatorCapability = (capability: string): boolean => {
  return capability in navigator;
};

export const hasWindowCapability = (capability: string): boolean => {
  return capability in window;
};

// Función helper para obtener el navegador extendido de forma segura
export const getExtendedNavigator = (): ExtendedNavigator => {
  return navigator as unknown as ExtendedNavigator;
};

// Función helper para obtener la ventana extendida de forma segura
export const getExtendedWindow = (): ExtendedWindow => {
  return window as unknown as ExtendedWindow;
};