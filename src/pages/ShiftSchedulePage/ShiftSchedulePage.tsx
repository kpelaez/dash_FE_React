// src/pages/ShiftSchedulePage/ShiftSchedulePage.tsx
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import Layout from '../../components/Layout/MainLayout';
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
  const [loadingShifts, setLoadingShifts] = useState(true); // ← Separado
  const [loadingStats, setLoadingStats] = useState(true);   // ← Separado
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  const loadData = async () => {
    try {
      setError(null);
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      // Cargar shifts primero (lo más importante)
      setLoadingShifts(true);
      shiftScheduleService.getShiftSchedules(startDate, endDate)
        .then(data => {
          setShifts(data);
          setLoadingShifts(false);
        })
        .catch(err => console.error('Error loading shifts:', err));

      // Cargar stats y alerts en paralelo (menos crítico)
      setLoadingStats(true);
      Promise.all([
        shiftScheduleService.getStats(startDate, endDate),
        shiftScheduleService.getAlerts()
      ])
        .then(([statsData, alertsData]) => {
          setStats(statsData);
          setAlerts(alertsData.alerts);
          setLoadingStats(false);
        })
        .catch(err => console.error('Error loading stats:', err));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
    const newDate = new Date(prev);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    return newDate;
    });
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
        {loadingStats ? (
          <div className="bg-gray-100 rounded-lg h-32 animate-pulse" />
        ) : stats.length > 0 ? (
          <StatsPanel stats={stats} currentMonth={currentMonth} />
        ) : null}

        {/* Calendario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loadingShifts && shifts.length === 0 ? (
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

          {/* Indicador de carga superpuesto */}
          {loadingShifts && shifts.length > 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShiftSchedulePage;