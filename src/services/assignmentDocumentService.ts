import axios, { AxiosError } from 'axios';
import type {
  AssignmentDocumentStatus,
  SendToHumandResponse
} from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configurar axios con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Helper para extraer mensaje de error legible desde respuestas de FastAPI
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status === 401) return 'Tu sesión expiró. Por favor iniciá sesión nuevamente.';
    if (status === 403) return 'No tenés permisos para realizar esta acción.';
    if (status === 400 && detail) return detail; // Incluye "Usuario sin DNI registrado"
    if (status === 404 && detail) return detail;
    if (detail) return typeof detail === 'string' ? detail : JSON.stringify(detail);
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
};

/**
 * Servicio para manejar documentos de asignación
 */
export const assignmentDocumentService = {
  
  /**
   * Generar preview del PDF de asignación
   */
  generatePreview: async (assignmentId: number): Promise<Blob> => {
    try{
      const response = await axios.post(
        `${API_URL}/api/v1/assignments/${assignmentId}/generate-preview`,
        {},
        {
          ...getAuthHeaders(),
          responseType: 'blob' // Importante para recibir el PDF
        }
      );
      return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Enviar documento a Humand
   */
  sendToHumand: async (
    assignmentId: number, 
    sendNotification: boolean = true
  ): Promise<SendToHumandResponse> => {
    const response = await axios.post(
      `${API_URL}/api/v1/assignments/${assignmentId}/send-to-humand`,
      { send_notification: sendNotification },
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Obtener estado del documento
   */
  getDocumentStatus: async (assignmentId: number): Promise<AssignmentDocumentStatus> => {
    const response = await axios.get(
      `${API_URL}/api/v1/assignments/${assignmentId}/document-status`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Descargar PDF (helper para abrir en nueva pestaña)
   */
  downloadPreview: async (assignmentId: number): Promise<void> => {
    const blob = await assignmentDocumentService.generatePreview(assignmentId);
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Limpiar después de un delay
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }
};