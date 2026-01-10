// src/pages/ShiftSchedulePage/components/AlertsBanner.tsx
import { ShiftAlert } from '../../../types/shiftSchedule';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface AlertsBannerProps {
  alerts: ShiftAlert[];
}

const AlertsBanner = ({ alerts }: AlertsBannerProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 flex items-start space-x-3 ${
            alert.severity === 'high'
              ? 'bg-red-50 border border-red-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="flex-shrink-0 text-2xl">
            {alert.severity === 'high' ? '🚨' : '⚠️'}
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold ${
                alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
              }`}
            >
              {alert.severity === 'high' ? 'Urgente' : 'Atención'}
            </h3>
            <p
              className={
                alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
              }
            >
              {alert.message} (
              {format(parseISO(alert.date), "EEEE d 'de' MMMM", { locale: es })})
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsBanner;