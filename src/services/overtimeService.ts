import { API_BASE_URL } from '../config/api';
import type {
  OvertimeEntryRead,
  OvertimeBalanceRead,
  OvertimeEntryCreate,
  OvertimeEntryReview,
  OvertimeStatus,
  OvertimeType,
} from '../types/overtime';

const ENDPOINT = '/api/overtime';

class OvertimeService {

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
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
    if (response.status === 204) return null as T;
    return response.json();
  }

  async createEntry(data: OvertimeEntryCreate): Promise<OvertimeEntryRead> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<OvertimeEntryRead>(response);
  }

  async reviewEntry(id: number, data: OvertimeEntryReview): Promise<OvertimeEntryRead> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}/review`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<OvertimeEntryRead>(response);
  }

  async cancelEntry(id: number): Promise<OvertimeEntryRead> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}/cancel`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OvertimeEntryRead>(response);
  }

  async getBalance(userId: number): Promise<OvertimeBalanceRead> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINT}/balance/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OvertimeBalanceRead>(response);
  }

  async listEntries(params?: {
    user_id?: number;
    status?: OvertimeStatus;
    entry_type?: OvertimeType;
    limit?: number;
    offset?: number;
  }): Promise<OvertimeEntryRead[]> {
    const query = new URLSearchParams();
    if (params?.user_id)     query.append('user_id', params.user_id.toString());
    if (params?.status)      query.append('status', params.status);
    if (params?.entry_type)  query.append('entry_type', params.entry_type);
    if (params?.limit)       query.append('limit', params.limit.toString());
    if (params?.offset)      query.append('offset', params.offset.toString());

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINT}/?${query.toString()}`,
      { method: 'GET', headers: this.getAuthHeaders() }
    );
    return this.handleResponse<OvertimeEntryRead[]>(response);
  }
}

export default new OvertimeService();