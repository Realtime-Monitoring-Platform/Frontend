// Common types used across the application

export type UserRole = 'PLATFORM_ADMIN' | 'TENANT_ADMIN' | 'EMBEDDED_ENGINEER' | 'OPERATOR' | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'PENDING_ACTIVATION';

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'WARNING' | 'ERROR';

export type DeviceType = 'SENSOR' | 'GATEWAY' | 'CONTROLLER' | 'SENSOR_ARRAY' | 'ACTUATOR' | 'CAMERA';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ESCALATED';

export type CommandStatus = 'PENDING' | 'EXECUTING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export type CommandType = 'RESTART_SERVICE' | 'CLEAR_CACHE' | 'UPDATE_CONFIG' | 'RUN_DIAGNOSTIC' | 'CUSTOM' | 'FIRMWARE_UPDATE';

export type TenantPlan = 'FREE' | 'PRO' | 'ENTERPRISE';

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'JSON';

export type ReportType = 'DEVICE_INVENTORY' | 'DEVICE_HEALTH' | 'PERFORMANCE' | 'INCIDENT' | 'AI_ANALYSIS';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: string;
  role: Role | string;
  permissions?: string[];
  team: Team;
  teamId?: string;
  roleId?: string;
  roleName?: string;
  
  tenantId?: string;
  tenantName?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  avatarUrl?: string;
  mustChangePassword: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: Permission[];
  permissionIds?: string[];
  userCount: number;
  isSystemRole: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  assignedRolesCount: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  teamLeaderId?: string;
  teamLeaderName?: string;

  deviceCount: number;
  userNumber: number;
  createdAt: string;
  tenantName?: string;

}

// Tenant types
export interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  userNumber: number;
  deviceNumber: number;
  teamNumber: number;

  alertNumber: number;

  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  companyName: string,
  AdminId: string

}





// Device types
export interface Device {
  id: string;
  deviceName: string
  teamId: string
  assignedUserId: string
  firmwareVersion: string
  tenantId: string
  model: string
  manufacturer: string
  hostname: string
  ipAddress: string
  macAddress: string
  location: string
  status: string



}

export interface createDeviceDto {

  deviceName: string
  teamId: string
  assignedUserId: string
  firmwareVersion: string
  tenantId: string
  model: string
  manufacturer: string
  hostname: string
  ipAddress: string
  macAddress: string
  location: string
  status: string
}

export interface DeviceMetrics {
  deviceId: string;
  timestamp: string;
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  temperature: number;
  uptime: number;
}

export interface DeviceLog {
  id: string;
  deviceId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

// Alert types
export interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  deviceId: string;
  deviceName: string;
  deviceLocation: string;
  message: string;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  comments: AlertComment[];
  relatedAlerts: string[];
}

export interface AlertComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Command {
  id: string;
  deviceId: string;
  deviceName: string;
  commandType: CommandType;
  parameters: Record<string, any>;
  status: CommandStatus;
  initiatedBy: string;
  timestamp: string;
  duration?: number;
  result?: string;
  error?: string;
}

export interface AIHealthScore {
  overall: number;
  categories: {
    deviceHealth: number;
    performance: number;
    security: number;
    reliability: number;
  };
}

export interface AIRecommendation {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  title: string;
  description: string;
  impact: string;
  action: string;
  deviceIds?: string[];
  estimatedSavings?: number;
  createdAt: string;
}

export interface AIPrediction {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  prediction: string;
  confidence: number;
  estimatedTime?: string;
  recommendedAction: string;
  createdAt: string;
}

export interface DashboardKPI {
  label: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  first_login?: boolean;
  expiresIn: number;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
}

export interface ActivateAccountRequest {
  token: string;
}

export interface Notification {
  id: string;
  type: 'ALERT' | 'COMMAND' | 'DEVICE' | 'SYSTEM' | 'USER';
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  link?: string;
   userId :string;
   tenantId :string;
createdAt:Date;

}

// Audit types
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  ipAddress: string;
  userAgent: string;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  generatedBy: string;

generatedAt: string;
  downloadUrl: string;
  parameters?: Record<string, any>;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number';
  options?: SelectOption[];
  placeholder?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: number | string;
}


export interface Pagination<T> {
  content: T[];
  empty: boolean,
  first: boolean,
  last: boolean,
  number: number,
  numberOfElements: number,
  pageable: {
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    unpaged: boolean
  },
  size: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  totalElements: number,
  totalPages: number
}