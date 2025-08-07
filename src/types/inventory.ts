// Tipos para el modulo de inventario en StoneFixer Frontend

export interface TechAsset {
    id: number;
    name: string;
    description?: string;
    brand: string;
    model: string;
    serial_number: string;
    asset_tag?: string;
    category: AssetCategory;
    status: AssetStatus;
    purchase_price?: number;
    purchase_date?: string;
    purchase_orden?: string;
    supplier?: string;
    warranty_expiry?: string;
    warranty_provider?: string;
    location ?:string;
    department ?: string;
    specifications ?: string;
    notes ?: string;
    created_at: string;
    updated_at?: string;
}

export interface TechAssetCreate {
  name: string;
  description?: string;
  brand: string;
  model: string;
  serial_number: string;
  asset_tag?: string;
  category: AssetCategory;
  status?: AssetStatus;
  purchase_price?: number;
  purchase_date?: string;
  purchase_order?: string;
  supplier?: string;
  warranty_expiry?: string;
  warranty_provider?: string;
  location?: string;
  department?: string;
  specifications?: string;
  notes?: string;
}

export interface TechAssetUpdate {
  name?: string;
  description?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
  category?: AssetCategory;
  status?: AssetStatus;
  purchase_price?: number;
  purchase_date?: string;
  purchase_order?: string;
  supplier?: string;
  warranty_expiry?: string;
  warranty_provider?: string;
  location?: string;
  department?: string;
  specifications?: string;
  notes?: string;
}

export enum AssetCategory {
  LAPTOP = "laptop",
  DESKTOP = "desktop",
  MONITOR = "monitor",
  KEYBOARD = "keyboard",
  MOUSE = "mouse",
  PRINTER = "printer",
  TABLET = "tablet",
  SMARTPHONE = "smartphone",
  SERVER = "server",
  NETWORK_EQUIPMENT = "network_equipment",
  ACCESSORIES = "accessories",
  SOFTWARE = "software",
  OTHER = "other"
}

export enum AssetStatus {
  AVAILABLE = "available",
  ASSIGNED = "assigned",
  IN_MAINTENANCE = "in_maintenance",
  OUT_OF_ORDER = "out_of_order",
  RETIRED = "retired"
}

export interface AssetAssignment {
  id: number;
  tech_asset_id: number;
  assigned_to_user_id: number;
  assigned_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  status: AssignmentStatus;
  assignment_reason?: string;
  location_of_use?: string;
  assigned_by_user_id?: number;
  condition_at_assignment?: string;
  condition_at_return?: string;
  assignment_notes?: string;
  return_notes?: string;
  created_at: string;
  updated_at?: string;
  // Datos extendidos
  tech_asset_name?: string;
  tech_asset_serial?: string;
  assigned_to_name?: string;
  assigned_by_name?: string;
}

export interface AssetAssignmentCreate {
  tech_asset_id: number;
  assigned_to_user_id: number;
  expected_return_date?: string;
  assignment_reason?: string;
  location_of_use?: string;
  condition_at_assignment?: string;
  assignment_notes?: string;
}

export enum AssignmentStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  TRANSFERRED = "transferred",
  LOST = "lost",
  DAMAGED = "damaged"
}

export interface AssetMaintenance {
  id: number;
  tech_asset_id: number;
  maintenance_type: MaintenanceType;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduled_date: string;
  estimated_duration_hours?: number;
  started_at?: string;
  completed_at?: string;
  assigned_technician_id?: number;
  requested_by_user_id?: number;
  procedures_performed?: string;
  parts_replaced?: string;
  tools_used?: string;
  labor_cost?: number;
  parts_cost?: number;
  external_service_cost?: number;
  maintenance_provider?: string;
  warranty_work: boolean;
  follow_up_required: boolean;
  follow_up_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // Datos extendidos
  tech_asset_name?: string;
  tech_asset_serial?: string;
  technician_name?: string;
  requested_by_name?: string;
  total_cost?: number;
}

export interface AssetMaintenanceCreate {
  tech_asset_id: number;
  maintenance_type: MaintenanceType;
  title: string;
  description: string;
  priority?: MaintenancePriority;
  scheduled_date: string;
  estimated_duration_hours?: number;
  assigned_technician_id?: number;
  maintenance_provider?: string;
  warranty_work?: boolean;
  notes?: string;
}

export enum MaintenanceType {
  PREVENTIVE = "preventive",
  CORRECTIVE = "corrective",
  UPGRADE = "upgrade",
  CLEANING = "cleaning",
  CALIBRATION = "calibration",
  REPAIR = "repair",
  REPLACEMENT = "replacement",
  INSPECTION = "inspection"
}

export enum MaintenanceStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  POSTPONED = "postponed",
  PENDING_PARTS = "pending_parts"
}

export enum MaintenancePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

// Tipos para dashboard y métricas
export interface InventoryMetrics {
  total_assets: number;
  available_assets: number;
  assigned_assets: number;
  maintenance_assets: number;
  active_assignments: number;
  pending_maintenances: number;
  overdue_maintenances: number;
  total_value?: number;
  category_distribution: Record<string, number>;
  status_distribution: Record<string, number>;
}

export interface DashboardData {
  success: boolean;
  data: InventoryMetrics;
  timestamp: string;
  error?: string;
}

// Tipos para filtros
export interface AssetFilters {
  search?: string;
  category?: AssetCategory;
  status?: AssetStatus;
  brand?: string;
  location?: string;
  department?: string;
}

export interface AssignmentFilters {
  status?: AssignmentStatus;
  user_id?: number;
  asset_id?: number;
  active_only?: boolean;
}

export interface MaintenanceFilters {
  status?: MaintenanceStatus;
  maintenance_type?: MaintenanceType;
  priority?: MaintenancePriority;
  asset_id?: number;
  technician_id?: number;
  date_from?: string;
  date_to?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Tipos para formularios
export interface TechAssetFormData {
  name: string;
  description: string;
  brand: string;
  model: string;
  serial_number: string;
  asset_tag: string;
  category: AssetCategory;
  purchase_price: string;
  purchase_date: string;
  supplier: string;
  warranty_expiry: string;
  warranty_provider: string;
  location: string;
  department: string;
  notes: string;
}

export interface MaintenanceFormData {
  tech_asset_id: string;
  maintenance_type: MaintenanceType;
  title: string;
  description: string;
  priority: MaintenancePriority;
  scheduled_date: string;
  estimated_duration_hours: string;
  assigned_technician_id: string;
  maintenance_provider: string;
  warranty_work: boolean;
  notes: string;
}

// Tipos para notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Tipos para estadísticas
export interface AssetStatistics {
  total_assets: number;
  status_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
  total_inventory_value: number;
  assets_with_warranty: number;
}

export interface AssignmentStatistics {
  total_assignments: number;
  active_assignments: number;
  status_distribution: Record<string, number>;
  users_with_active_assignments: number;
}

export interface MaintenanceMetrics {
  total_maintenances: number;
  completed_maintenances: number;
  pending_maintenances: number;
  overdue_maintenances: number;
  average_completion_time_hours?: number;
  total_maintenance_cost?: number;
  preventive_vs_corrective_ratio?: number;
}

// Tipos para tablas
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  onChange: (page: number, pageSize: number) => void;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Utilidad para opciones de select
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}