// Configuración para conectar el frontend con el backend en red local

// Función para obtener la IP base de la URL actual
// const getBaseURL = (): string => {
//   // Si estamos en desarrollo local
//   if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//     return 'http://localhost:8000';
//   }
  
//   // Si accedemos desde otro dispositivo en la red
//   // Usar la misma IP que el frontend pero puerto 8000 para el backend
//   const hostname = window.location.hostname;
//   return `http://${hostname}:8000`;
// };

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// // Configuración de la API
// export const API_CONFIG = {
//   BASE_URL,
//   ENDPOINTS: {
//     AUTH: '/token',
//     USERS: '/users',
//     INVENTORY: {
//       TECH_ASSETS: '/inventory/tech-assets',
//       ASSIGNMENTS: '/inventory/assignments',
//       MAINTENANCE: '/inventory/maintenance'
//     },
//     BUSINESS_INDICATORS: '/api/business-indicators'
//   },
//   TIMEOUT: 10000,
// };

// // URL completa para cada endpoint
// export const API_URLS = {
//   AUTH: `${BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`,
//   USERS: `${BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
//   TECH_ASSETS: `${BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY.TECH_ASSETS}`,
//   ASSIGNMENTS: `${BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY.ASSIGNMENTS}`,
//   MAINTENANCE: `${BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY.MAINTENANCE}`,
//   BUSINESS_INDICATORS: `${BASE_URL}${API_CONFIG.ENDPOINTS.BUSINESS_INDICATORS}`,
//   DOCS: `${BASE_URL}/docs`,
// };

// // Headers por defecto
// export const DEFAULT_HEADERS = {
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
// };

// // Función helper para obtener headers con token
// export const getAuthHeaders = (token?: string) => {
//   const headers = new Headers(DEFAULT_HEADERS);
  
//   if (token) {
//     headers.set('Authorization',`Bearer ${token}`);
//   }
  
//   return headers;
// };

// // Función para verificar si el backend está disponible
// export const checkBackendHealth = async (): Promise<boolean> => {
//   const controller = new AbortController();
//   window.setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

//   try {
//     const response = await fetch(`${BASE_URL}/health`, {
//       method: 'GET',
//       signal: controller.signal,
//       headers: DEFAULT_HEADERS,
//     });
//     return response.ok;
//   } catch (error) {
//     console.error('Backend no disponible:', error);
//     return false;
//   }
// };

// if (import.meta.env.DEV) {
//   console.log('🔧 API Configuration:', {
//     BASE_URL,
//     ENV: import.meta.env.MODE,
//     DOCS_URL: API_URLS.DOCS
//   });
// }

const isDev = import.meta.env.DEV;
 
// En producción usamos la URL completa del backend.
// En desarrollo dejamos el path vacío para que los fetches sean relativos
// y pasen por el proxy de Vite (configurado en vite.config.ts).
export const API_URL = isDev ? '' : (import.meta.env.VITE_API_URL || '');

export const API_BASE_URL = isDev ? '' : (import.meta.env.VITE_API_URL || '');
 
if (isDev) {
  console.log('🔧 Modo desarrollo: usando paths relativos + proxy de Vite');
} else {
  console.log('🚀 Modo producción:', API_URL);
}