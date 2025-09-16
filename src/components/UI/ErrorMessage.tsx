import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    showIcon?: boolean;
    variant?: 'default' | 'compact';
}


const ErrorMessage: React.FC<ErrorMessageProps> = ({message, onRetry, showIcon, variant = 'default'}) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        {showIcon && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
        <span className="text-sm text-red-700 flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Reintentar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="text-center py-8 px-4">
      {showIcon && (
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops, algo salió mal
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar nuevamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;