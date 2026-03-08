// Configuración para conectar el frontend con el backend en red local

// Función para obtener la IP base de la URL actual
const getBaseURL = (): string => {
  // Si estamos en desarrollo local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Si accedemos desde otro dispositivo en la red
  // Usar la misma IP que el frontend pero puerto 8000 para el backend
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`;
};

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  ENDPOINTS: {
    AUTH: '/token',
    USERS: '/users',
    INVENTORY: {
      TECH_ASSETS: '/inventory/tech-assets',
      ASSIGNMENTS: '/inventory/assignments',
      MAINTENANCE: '/inventory/maintenance'
    },
    BUSINESS_INDICATORS: '/api/business-indicators'
  },
  TIMEOUT: 10000, // 10 segundos
};

// URL completa para cada endpoint
export const API_URLS = {
  AUTH: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`,
  USERS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
  TECH_ASSETS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY.TECH_ASSETS}`,
  ASSIGNMENTS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY.ASSIGNMENTS}`,
  MAINTENANCE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY.MAINTENANCE}`,
  BUSINESS_INDICATORS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BUSINESS_INDICATORS}`,
  DOCS: `${API_CONFIG.BASE_URL}/docs`,
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Función helper para obtener headers con token
export const getAuthHeaders = (token?: string) => {
  const headers = new Headers(DEFAULT_HEADERS);
  
  if (token) {
    headers.set('Authorization',`Bearer ${token}`);
  }
  
  return headers;
};

// Función para verificar si el backend está disponible
export const checkBackendHealth = async (): Promise<boolean> => {
  const controller = new AbortController();
  window.setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/`, {
      method: 'GET',
      signal: controller.signal,
      headers: DEFAULT_HEADERS,
    });
    return response.ok;
  } catch (error) {
    console.error('Backend no disponible:', error);
    return false;
  }
};

// Logging para debug
console.log('🔧 API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  HOSTNAME: window.location.hostname,
  DOCS_URL: API_URLS.DOCS
});