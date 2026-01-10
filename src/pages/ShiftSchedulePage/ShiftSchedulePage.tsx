// src/pages/ShiftSchedulePage/ShiftSchedulePage.tsx
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import Layout from '../../components/Layout/Layout';
import CalendarView from './components/CalendarView';
import StatsPanel from './components/StatsPanel';
import AlertsBanner from './components/AlertsBanner';
import shiftScheduleService from '../../services/shiftScheduleService';
import { ShiftSchedule, ShiftScheduleStats, ShiftAlert } from '../../types/shiftSchedule';

const ShiftSchedulePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [shifts, setShifts] = useState<ShiftSchedule[]>([]);
  const [stats, setStats] = useState<ShiftScheduleStats[]>([]);
  const [alerts, setAlerts] = useState<ShiftAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      // Cargar en paralelo
      const [shiftsData, statsData, alertsData] = await Promise.all([
        shiftScheduleService.getShiftSchedules(startDate, endDate),
        shiftScheduleService.getStats(startDate, endDate),
        shiftScheduleService.getAlerts()
      ]);

      setShifts(shiftsData);
      setStats(statsData);
      setAlerts(alertsData.alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
      console.error('Error loading shift data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1));
  };

  const handleShiftCreated = () => {
    loadData(); // Recargar datos después de crear
  };

  const handleShiftUpdated = () => {
    loadData(); // Recargar datos después de actualizar
  };

  const handleShiftDeleted = () => {
    loadData(); // Recargar datos después de eliminar
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Calendario de Turnos - Stock
            </h1>
            <p className="text-gray-600 mt-1">
              Organiza y visualiza los turnos del equipo
            </p>
          </div>
        </div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <AlertsBanner alerts={alerts} />
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Estadísticas */}
        {stats.length > 0 && (
          <StatsPanel stats={stats} currentMonth={currentMonth} />
        )}

        {/* Calendario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <CalendarView
              shifts={shifts}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              onShiftCreated={handleShiftCreated}
              onShiftUpdated={handleShiftUpdated}
              onShiftDeleted={handleShiftDeleted}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShiftSchedulePage;