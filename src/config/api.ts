// Configuración para conectar el frontend con el backend en red local

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE_URL = API_URL;

console.log(`[StoneFixer] Entorno: ${import.meta.env.MODE} | API: ${API_URL}`);