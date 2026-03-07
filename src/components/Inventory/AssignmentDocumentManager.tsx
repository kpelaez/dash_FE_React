// src/components/inventory/AssignmentDocumentManager.tsx (NUEVO)

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Bell,
  BellOff
} from 'lucide-react';
import { assignmentDocumentService } from '../../services/assignmentDocumentService';
import type { AssetAssignment, AssignmentDocumentStatus } from '../../types/inventory';
import toast from 'react-hot-toast';

interface AssignmentDocumentManagerProps {
  assignment: AssetAssignment;
  onDocumentSent?: () => void;
}

export const AssignmentDocumentManager: React.FC<AssignmentDocumentManagerProps> = ({
  assignment,
  onDocumentSent
}) => {
  const [status, setStatus] = useState<AssignmentDocumentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);

  useEffect(() => {
    loadDocumentStatus();
  }, [assignment.id]);

  const loadDocumentStatus = async () => {
    try {
      const data = await assignmentDocumentService.getDocumentStatus(assignment.id);
      setStatus(data);
    } catch (err: any) {
      console.error('Error loading document status:', err);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await assignmentDocumentService.downloadPreview(assignment.id);
      toast.success('PDF generado correctamente');
    } catch (err: any) {
      const errorMsg = err.message || 'Error al generar el preview del documento';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToHumand = async () => {
    setLoading(true);
    setError(null);

    try {
      await assignmentDocumentService.sendToHumand(assignment.id, sendNotification);
      
      await loadDocumentStatus();
      
      toast.success('Documento enviado a Humand exitosamente');
      onDocumentSent?.();
      setSendDialogOpen(false);
      
    } catch (err: any) {
      const errorMsg = err.message || 'Error al enviar el documento a Humand';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const documentSent = status?.document_sent || assignment.document_sent_to_humand;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Documento de Asignación
            </h3>
          </div>
          
          {documentSent ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Enviado a Humand
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Pendiente de envío
            </span>
          )}
        </div>

        <div className="border-t border-gray-200" />

        {/* Estado */}
        {documentSent && status && (
          <div className="bg-gray-50 rounded-md p-3 space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Enviado:</span>{' '}
              {new Date(status.sent_at!).toLocaleString('es-AR')}
            </p>
            {status.document_name && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Archivo:</span>{' '}
                {status.document_name}
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            Ver Preview
          </button>

          {!documentSent && (
            <button
              onClick={() => setSendDialogOpen(true)}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar a Humand
            </button>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-900">
            <FileText className="h-3.5 w-3.5 inline mr-1" />
            El documento incluye los datos del activo, empleado y las políticas de uso que deben ser firmadas en Humand.
          </p>
        </div>
      </div>

      {/* Modal de confirmación */}
      {sendDialogOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSendDialogOpen(false)}
          />
          
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enviar documento a Humand
                  </h3>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <p className="text-sm text-gray-700">
                    El documento será enviado al legajo del empleado{' '}
                    <strong>{assignment.assigned_to_name}</strong> en Humand para su firma.
                  </p>

                  <div className="flex items-center">
                    <input
                      id="notification"
                      type="checkbox"
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notification" className="ml-3 text-sm text-gray-700 flex items-center">
                      {sendNotification ? (
                        <Bell className="h-4 w-4 mr-1 text-emerald-600" />
                      ) : (
                        <BellOff className="h-4 w-4 mr-1 text-gray-400" />
                      )}
                      Enviar notificación al empleado
                    </label>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                    <p className="text-xs text-yellow-800">
                      Una vez enviado, el documento no puede ser modificado. 
                      Asegúrate de haber revisado el preview antes de continuar.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                  <button
                    onClick={() => setSendDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSendToHumand}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Confirmar y Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};