import {
    TechAsset,
    TechAssetCreate,
    TechAssetUpdate,
    AssetAssignment,
    AssetAssignmentCreate,
    AssetMaintenance,
    AssetMaintenanceCreate,
    AssetFilters,
    AssignmentFilters,
    MaintenanceFilters,
    DashboardData,
    AssetStatistics,
    AssignmentStatistics,
    MaintenanceMetrics,
    AssetCategory,
    AssetStatus
} from '../types/inventory';

// Configuracion base de la API
const API_BASE_URL = import.meta.env.BASE_URL || 'http://localhost:8000'

class InventoryApiService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type':'application/json',
            ...(token && { Authorizacion: `Bearer ${token}` })
        };
    }

    private async request<T> (
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: this.getAuthHeaders(),
                ...options,
            });

            if(!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.message || errorMessage;
                } catch {

                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getTechAssets(filters?: AssetFilters): Promise<TechAsset[]> {
        const params = new URLSearchParams();

        if(filters){
            Object.entries(filters).forEach(([key, value]) => {
                if (value != undefined && value != null && value != '') {
                    params.append(key, value.toString());
                }
            });
        }

        const query = params.toString();
        return this.request<TechAsset[]>(`/inventory/tech-assets${query ? `?${query}` : ''}`);
    }

    async  getTechAsset(id: number): Promise<TechAsset> {
        return this.request<TechAsset>(`/inventory/tech-assets/${id}`);
    }

    async createTechAsset(asset: TechAssetCreate): Promise<TechAsset> {
        return this.request<TechAsset>('/inventory/tech-assets', {
            method: 'POST',
            body: JSON.stringify(asset),
        });
    }

    async updateTechAsset(id: number, asset: TechAssetUpdate): Promise<TechAsset> {
        return this.request<TechAsset>(`/inventory/tech-assets/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(asset)
        });
    }

    async deleteTechAsset(id: number): Promise<void> {
        await this.request<void>(`/invetory/tech-assets/${id}`, {
            method: 'DELETE'
        });
    }

    async updateAssetStatus(id: number, status: AssetStatus): Promise<TechAsset> {
        return this.request<TechAsset>(`/inventory/tech-assets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        });
    }

    async getAssetCategories(): Promise<{ value: string; label: string }[]> {
        return this.request<{ value: string; label: string }[]>('/inventory/tech-assets/categories/list');
    }

    async getAssetStatuses(): Promise<{ value: string; label: string }[]> {
        return this.request<{ value: string; label: string }[]>('/inventory/tech-assets/status/list');
    }

    async getAssetsWarrantyExpiring(daysAhead: number = 30): Promise<{
        days_ahead: number;
        count: number;
        assets: TechAsset[];
    }> {
        return this.request(`/inventory/tech-assets/warranty/expiring?days_ahead=${daysAhead}`);
    }

    async generateAssetTag(category: AssetCategory, location?: string): Promise<{
        asset_tag: string;
        category: string;
        location?: string;
    }> {
        const body: any = { category };
        if (location) body.location = location;
        
        return this.request('/inventory/tech-assets/generate-tag', {
        method: 'POST',
        body: JSON.stringify(body),
        });
    }

    async getAssetStatistics(): Promise<AssetStatistics> {
        return this.request<AssetStatistics>('/inventory/tech-assets/statistics/overview');
    }

    // === ASSIGNMENTS ===

    async getAssignments(filters?: AssignmentFilters): Promise<AssetAssignment[]> {
        const params = new URLSearchParams();
        
        if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
            }
        });
        }

        const query = params.toString();
        return this.request<AssetAssignment[]>(`/inventory/assignments${query ? `?${query}` : ''}`);
    }

    async getAssignment(id: number): Promise<AssetAssignment> {
        return this.request<AssetAssignment>(`/inventory/assignments/${id}`);
    }

    async createAssignment(assignment: AssetAssignmentCreate): Promise<AssetAssignment> {
        return this.request<AssetAssignment>('/inventory/assignments', {
        method: 'POST',
        body: JSON.stringify(assignment),
        });
    }

    async returnAsset(
        assignmentId: number,
        returnData: {
        actual_return_date?: string;
        condition_at_return?: string;
        return_notes?: string;
        }
    ): Promise<AssetAssignment> {
        return this.request<AssetAssignment>(`/inventory/assignments/${assignmentId}/return`, {
        method: 'POST',
        body: JSON.stringify(returnData),
        });
    }

    async transferAsset(
        assignmentId: number,
        newUserId: number,
        transferNotes?: string
    ): Promise<AssetAssignment> {
        const params = new URLSearchParams();
        params.append('new_user_id', newUserId.toString());
        if (transferNotes) params.append('transfer_notes', transferNotes);

        return this.request<AssetAssignment>(`/inventory/assignments/${assignmentId}/transfer?${params.toString()}`, {
        method: 'POST',
        });
    }

    async deleteAssignment(id: number): Promise<void> {
        await this.request<void>(`/inventory/assignments/${id}`, {
        method: 'DELETE',
        });
    }

    async getUserAssignments(userId: number, activeOnly: boolean = true): Promise<AssetAssignment[]> {
        return this.request<AssetAssignment[]>(`/inventory/assignments/user/${userId}?active_only=${activeOnly}`);
    }

    async getAssetAssignmentHistory(assetId: number): Promise<AssetAssignment[]> {
        return this.request<AssetAssignment[]>(`/inventory/assignments/asset/${assetId}/history`);
    }

    async getMyAssignments(): Promise<AssetAssignment[]> {
        return this.request<AssetAssignment[]>('/inventory/assignments/my-assets');
    }

    async getAssignmentStatistics(): Promise<AssignmentStatistics> {
        return this.request<AssignmentStatistics>('/inventory/assignments/statistics/overview');
    }

    // === MAINTENANCE ===

    async getMaintenances(filters?: MaintenanceFilters): Promise<AssetMaintenance[]> {
        const params = new URLSearchParams();
        
        if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
            }
        });
        }

        const query = params.toString();
        return this.request<AssetMaintenance[]>(`/inventory/maintenance${query ? `?${query}` : ''}`);
    }

    async getMaintenance(id: number): Promise<AssetMaintenance> {
        return this.request<AssetMaintenance>(`/inventory/maintenance/${id}`);
    }

    async createMaintenance(maintenance: AssetMaintenanceCreate): Promise<AssetMaintenance> {
        return this.request<AssetMaintenance>('/inventory/maintenance', {
        method: 'POST',
        body: JSON.stringify(maintenance),
        });
    }

    async updateMaintenance(id: number, maintenance: Partial<AssetMaintenanceCreate>): Promise<AssetMaintenance> {
        return this.request<AssetMaintenance>(`/inventory/maintenance/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(maintenance),
        });
    }

    async startMaintenance(id: number, notes?: string): Promise<AssetMaintenance> {
        return this.request<AssetMaintenance>(`/inventory/maintenance/${id}/start`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
        });
    }

    async completeMaintenance(
        id: number,
        completionData: {
        procedures_performed?: string;
        parts_replaced?: string;
        tools_used?: string;
        labor_cost?: number;
        parts_cost?: number;
        external_service_cost?: number;
        follow_up_required?: boolean;
        follow_up_date?: string;
        notes?: string;
        }
    ): Promise<AssetMaintenance> {
        return this.request<AssetMaintenance>(`/inventory/maintenance/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(completionData),
        });
    }

    async cancelMaintenance(id: number, reason?: string): Promise<AssetMaintenance> {
        const params = new URLSearchParams();
        if (reason) params.append('reason', reason);

        return this.request<AssetMaintenance>(`/inventory/maintenance/${id}/cancel?${params.toString()}`, {
        method: 'POST',
        });
    }

    async deleteMaintenance(id: number): Promise<void> {
        await this.request<void>(`/inventory/maintenance/${id}`, {
        method: 'DELETE',
        });
    }

    async getAssetMaintenanceHistory(assetId: number): Promise<AssetMaintenance[]> {
        return this.request<AssetMaintenance[]>(`/inventory/maintenance/asset/${assetId}/history`);
    }

    async getUpcomingMaintenances(daysAhead: number = 30): Promise<AssetMaintenance[]> {
        return this.request<AssetMaintenance[]>(`/inventory/maintenance/upcoming/schedule?days_ahead=${daysAhead}`);
    }

    async getOverdueMaintenances(): Promise<AssetMaintenance[]> {
        return this.request<AssetMaintenance[]>('/inventory/maintenance/overdue/list');
    }

    async getMyAssignedMaintenances(): Promise<AssetMaintenance[]> {
        return this.request<AssetMaintenance[]>('/inventory/maintenance/my-assigned');
    }

    async getMaintenanceMetrics(dateFrom?: string, dateTo?: string): Promise<MaintenanceMetrics> {
        const params = new URLSearchParams();
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);

        const query = params.toString();
        return this.request<MaintenanceMetrics>(`/inventory/maintenance/metrics/overview${query ? `?${query}` : ''}`);
    }

    async schedulePreventiveMaintenance(
        assetId: number,
        intervalDays: number = 90
    ): Promise<AssetMaintenance> {
        return this.request<AssetMaintenance>(`/inventory/maintenance/asset/${assetId}/schedule-preventive`, {
        method: 'POST',
        body: JSON.stringify({ maintenance_interval_days: intervalDays }),
        });
    }

    // === DASHBOARD ===

    async getDashboardData(): Promise<DashboardData> {
        return this.request<DashboardData>('/api/dashboard/inventory');
    }

    async getAssetUtilizationData(): Promise<any> {
        return this.request('/api/dashboard/assets/utilization');
    }

    async getMaintenanceDashboardData(): Promise<any> {
        return this.request('/api/dashboard/maintenance');
    }

    // === UTILITIES ===

    async getUsers(): Promise<any[]> {
        return this.request<any[]>('/users');
    }

    // Método para manejar errores de forma centralizada
    handleApiError(error: unknown): string {
        if (error instanceof Error) {
        return error.message;
        }
        return 'Ha ocurrido un error inesperado';
    }
}

// Instancia singleton del servicio
export const inventoryApi = new InventoryApiService();
export default inventoryApi;
