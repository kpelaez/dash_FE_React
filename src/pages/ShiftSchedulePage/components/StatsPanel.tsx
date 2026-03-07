// src/pages/ShiftSchedulePage/components/StatsPanel.tsx
import { ShiftScheduleStats } from '../../../types/shiftSchedule';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StatsPanelProps {
  stats: ShiftScheduleStats[];
  currentMonth: Date;
}

const StatsPanel = ({ stats, currentMonth }: StatsPanelProps) => {
  if (stats.length === 0) return null;

  const totalShifts = stats.reduce((sum, stat) => sum + stat.total_shifts, 0);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📊 Estadísticas de{' '}
        {format(currentMonth, "MMMM yyyy", { locale: es })}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.user_id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-2">
              {stat.user_full_name}
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-emerald-600">
                  {stat.total_shifts} turnos
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Early (7am):</span>
                <span className="font-medium text-orange-600">
                  {stat.early_shifts}
                </span>
              </div>
              
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Porcentaje:</span>
                  <span className="font-bold text-gray-800">
                    {stat.percentage_of_total.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${stat.percentage_of_total}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Total de turnos del equipo: <strong>{totalShifts}</strong>
      </div>
    </div>
  );
};

export default StatsPanel;