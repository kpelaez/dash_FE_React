import axios from 'axios';
import type {
  AssignmentDocumentStatus,
  SendToHumandRequest,
  SendToHumandResponse
} from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configurar axios con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

/**
 * Servicio para manejar documentos de asignación
 */
export const assignmentDocumentService = {
  
  /**
   * Generar preview del PDF de asignación
   */
  generatePreview: async (assignmentId: number): Promise<Blob> => {
    const response = await axios.post(
      `${API_URL}/api/v1/assignments/${assignmentId}/generate-preview`,
      {},
      {
        ...getAuthHeaders(),
        responseType: 'blob' // Importante para recibir el PDF
      }
    );
    return response.data;
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