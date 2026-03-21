// Configuración para conectar el frontend con el backend en red local

const isDev = import.meta.env.DEV;
 
// En producción usamos la URL completa del backend.
// En desarrollo dejamos el path vacío para que los fetches sean relativos
// y pasen por el proxy de Vite (configurado en vite.config.ts).
export const API_URL = isDev ? '' : (import.meta.env.VITE_API_URL || '');

export const API_BASE_URL = isDev ? '' : (import.meta.env.VITE_API_URL || '');
 
if (isDev) {
  console.log('Modo desarrollo: usando paths relativos + proxy de Vite');
} else {
  console.log('Modo producción:', API_URL);
}