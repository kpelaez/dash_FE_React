import { 
  ShiftSchedule, 
  ShiftScheduleCreate, 
  ShiftScheduleUpdate,
  ShiftScheduleStats,
  ShiftAlertsResponse 
} from '../types/shiftSchedule';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const ENDPOINT = '/api/shift-schedules';

class ShiftScheduleService {
  
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
      
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Error ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  /**
   * Obtener turnos en un rango de fechas
   */
  async getShiftSchedules(
    startDate: string,
    endDate: string,
    userId?: number,
    shiftType?: string
  ): Promise<ShiftSchedule[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      department: 'stock'
    });

    if (userId) params.append('user_id', userId.toString());
    if (shiftType) params.append('shift_type', shiftType);

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINT}?${params.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<ShiftSchedule[]>(response);
  }

  /**
   * Crear un nuevo turno
   */
  async createShiftSchedule(data: ShiftScheduleCreate): Promise<ShiftSchedule> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ShiftSchedule>(response);
  }

  /**
   * Actualizar un turno
   */
  async updateShiftSchedule(
    id: number,
    data: ShiftScheduleUpdate
  ): Promise<ShiftSchedule> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ShiftSchedule>(response);
  }

  /**
   * Cancelar un turno
   */
  async deleteShiftSchedule(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<void>(response);
  }

  /**
   * Obtener estadísticas
   */
  async getStats(
    startDate: string,
    endDate: string
  ): Promise<ShiftScheduleStats[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      department: 'stock'
    });

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINT}/stats?${params.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<ShiftScheduleStats[]>(response);
  }

  /**
   * Obtener alertas
   */
  async getAlerts(): Promise<ShiftAlertsResponse> {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINT}/alerts?department=stock`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<ShiftAlertsResponse>(response);
  }
}

export default new ShiftScheduleService();