import {
  mockUsers, mockRoles, mockPermissions, mockTeams, mockTenants,
  mockDevices, mockDeviceMetrics, mockDeviceLogs, mockAlerts, mockCommands,
  mockAIHealthScore, mockAIRecommendations, mockAIPredictions,
  mockReports, mockNotifications,
  mockDeviceStatusChart, mockAlertTrendChart, mockPerformanceChart, mockDeviceTypeChart,
  paginate,
} from './mockData';
import type {
  User, Role, Team, Tenant, Device, Alert, Report, AuditLog,
  PaginatedResponse, AIHealthScore, AIRecommendation, AIPrediction,
  DeviceMetrics, DeviceLog, Command, Notification,
} from '@/types';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mutable in-memory stores (so CRUD operations persist during session)
let users = [...mockUsers];
let roles = [...mockRoles];
let teams = [...mockTeams];
let tenants = [...mockTenants];
let devices = [...mockDevices];
let alerts = [...mockAlerts];
let reports = [...mockReports];
let auditLogs: AuditLog[] = Array.from({ length: 30 }, (_, i) => {
  const user = mockUsers[i % mockUsers.length];
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'CONFIG_CHANGE'];
  const resources = ['User', 'Tenant', 'Device', 'Role', 'Team', 'Alert', 'Report', 'Settings'];
  const action = actions[i % actions.length];
  const resource = resources[i % resources.length];
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 14));
  d.setHours(d.getHours() - Math.floor(Math.random() * 23));
  return {
    id: `audit${i + 1}`,
    timestamp: d.toISOString(),
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    action,
    resourceType: resource,
    resourceId: `${resource.toLowerCase()}-${Math.floor(Math.random() * 100) + 1}`,
    changes: action === 'UPDATE' ? { before: { status: 'ACTIVE' }, after: { status: 'INACTIVE' } } : {},
    ipAddress: `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 50) + 1}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
  };
});

const genId = (prefix: string) => `${prefix}${Date.now()}`;
const nowIso = () => new Date().toISOString();

// ─── Users CRUD ───────────────────────────────────────────────────────────────
export const mockUserApi = {
  list: async (page = 0, size = 20): Promise<PaginatedResponse<User>> => {
    await delay();
    return paginate(users, page, size);
  },
  getById: async (id: string): Promise<User> => {
    await delay();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },
  create: async (data: Partial<User>): Promise<User> => {
    await delay();
    const newUser: User = {
      id: genId('u'),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      username: data.username || data.email?.split('@')[0] || '',
      status: data.status || 'ACTIVE',
      role: data.role || mockRoles[0],
      team: data.team || mockTeams[0],
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      phone: data.phone,
      mustChangePassword: data.mustChangePassword || false,
    };
    users = [...users, newUser];
    return newUser;
  },
  update: async (id: string, data: Partial<User>): Promise<User> => {
    await delay();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    const updated = { ...users[idx], ...data, id, updatedAt: nowIso() };
    users = users.map(u => u.id === id ? updated : u);
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    await delay();
    users = users.filter(u => u.id !== id);
  },
};

// ─── Tenants CRUD ─────────────────────────────────────────────────────────────


// ─── Devices CRUD ─────────────────────────────────────────────────────────────
export const mockDeviceApi = {
  list: async (page = 0, size = 20): Promise<PaginatedResponse<Device>> => {
    await delay();
    return paginate(devices, page, size);
  },
  getById: async (id: string): Promise<Device> => {
    await delay();
    const device = devices.find(d => d.id === id);
    if (!device) throw new Error('Device not found');
    return device;
  },
  create: async (data: Partial<Device>): Promise<Device> => {
    await delay();
    const newDevice: Device = {
      id: genId('d'),
      name: data.name || '',
      deviceId: data.deviceId || `DEV-${Date.now()}`,
      type: data.type || 'SENSOR',
      ipAddress: data.ipAddress,
      status: data.status || 'OFFLINE',
      location: data.location || '',
      teamId: data.teamId || '',
      teamName: data.teamName,
      description: data.description,
      firmwareVersion: data.firmwareVersion || 'v1.0.0',
      metadata: data.metadata,
      lastSeen: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    devices = [...devices, newDevice];
    return newDevice;
  },
  update: async (id: string, data: Partial<Device>): Promise<Device> => {
    await delay();
    const idx = devices.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Device not found');
    const updated = { ...devices[idx], ...data, id, updatedAt: nowIso() };
    devices = devices.map(d => d.id === id ? updated : d);
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    await delay();
    devices = devices.filter(d => d.id !== id);
  },
  getMetrics: async (deviceId: string): Promise<DeviceMetrics[]> => {
    await delay();
    return mockDeviceMetrics.filter(m => m.deviceId === deviceId);
  },
  getLogs: async (deviceId: string): Promise<DeviceLog[]> => {
    await delay();
    return mockDeviceLogs.filter(l => l.deviceId === deviceId);
  },
};

// ─── Teams CRUD ───────────────────────────────────────────────────────────────


// ─── Roles CRUD ───────────────────────────────────────────────────────────────
export const mockRoleApi = {
  list: async (page = 0, size = 20): Promise<PaginatedResponse<Role>> => {
    await delay();
    return paginate(roles, page, size);
  },
  getById: async (id: string): Promise<Role> => {
    await delay();
    const role = roles.find(r => r.id === id);
    if (!role) throw new Error('Role not found');
    return role;
  },
  create: async (data: Partial<Role>): Promise<Role> => {
    await delay();
    const newRole: Role = {
      id: genId('r'),
      name: data.name || '',
      description: data.description || '',
      permissions: data.permissions || [],
      userCount: 0,
      isSystemRole: false,
      createdAt: nowIso(),
    };
    roles = [...roles, newRole];
    return newRole;
  },
  update: async (id: string, data: Partial<Role>): Promise<Role> => {
    await delay();
    const idx = roles.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Role not found');
    const updated = { ...roles[idx], ...data, id };
    roles = roles.map(r => r.id === id ? updated : r);
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    await delay();
    roles = roles.filter(r => r.id !== id);
  },
};

// ─── Alerts CRUD ──────────────────────────────────────────────────────────────
export const mockAlertApi = {
  list: async (page = 0, size = 20): Promise<PaginatedResponse<Alert>> => {
    await delay();
    return paginate(alerts, page, size);
  },
  getById: async (id: string): Promise<Alert> => {
    await delay();
    const alert = alerts.find(a => a.id === id);
    if (!alert) throw new Error('Alert not found');
    return alert;
  },
  acknowledge: async (id: string, username: string): Promise<Alert> => {
    await delay();
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Alert not found');
    const updated = { ...alerts[idx], status: 'ACKNOWLEDGED' as const, acknowledgedBy: username, acknowledgedAt: nowIso() };
    alerts = alerts.map(a => a.id === id ? updated : a);
    return updated;
  },
  resolve: async (id: string, username: string): Promise<Alert> => {
    await delay();
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Alert not found');
    const updated = { ...alerts[idx], status: 'RESOLVED' as const, resolvedBy: username, resolvedAt: nowIso() };
    alerts = alerts.map(a => a.id === id ? updated : a);
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    await delay();
    alerts = alerts.filter(a => a.id !== id);
  },
};

// ─── Reports CRUD ─────────────────────────────────────────────────────────────
export const mockReportApi = {
  list: async (page = 0, size = 20): Promise<PaginatedResponse<Report>> => {
    await delay();
    return paginate(reports, page, size);
  },
  getById: async (id: string): Promise<Report> => {
    await delay();
    const report = reports.find(r => r.id === id);
    if (!report) throw new Error('Report not found');
    return report;
  },
  create: async (data: Partial<Report>): Promise<Report> => {
    await delay();
    const newReport: Report = {
      id: genId('rep'),
      name: data.name || 'Untitled Report',
      type: data.type || 'DEVICE_INVENTORY',
      format: data.format || 'PDF',
      generatedBy: data.generatedBy || 'system',
      generatedAt: nowIso(),
      downloadUrl: `/api/reports/${Date.now()}/download`,
      parameters: data.parameters,
    };
    reports = [...reports, newReport];
    return newReport;
  },
  delete: async (id: string): Promise<void> => {
    await delay();
    reports = reports.filter(r => r.id !== id);
  },
};

// ─── Audit Logs (read-only) ───────────────────────────────────────────────────
export const mockAuditApi = {
  list: async (page = 0, size = 20): Promise<PaginatedResponse<AuditLog>> => {
    await delay();
    return paginate(auditLogs, page, size);
  },
};

// ─── AI (read-only) ───────────────────────────────────────────────────────────
export const mockAIApi = {
  getHealthScore: async (): Promise<AIHealthScore> => {
    await delay();
    return mockAIHealthScore;
  },
  getRecommendations: async (): Promise<AIRecommendation[]> => {
    await delay();
    return mockAIRecommendations;
  },
  getPredictions: async (): Promise<AIPrediction[]> => {
    await delay();
    return mockAIPredictions;
  },
};

// ─── Commands (read-only) ─────────────────────────────────────────────────────
export const mockCommandApi = {
  list: async (deviceId?: string): Promise<Command[]> => {
    await delay();
    if (deviceId) return mockCommands.filter(c => c.deviceId === deviceId);
    return mockCommands;
  },
};

// ─── Notifications (read-only) ────────────────────────────────────────────────
export const mockNotificationApi = {
  list: async (): Promise<Notification[]> => {
    await delay();
    return mockNotifications;
  },
};

// ─── Dashboard Chart Data ─────────────────────────────────────────────────────
export const mockDashboardApi = {
  getDeviceStatusChart: async () => {
    await delay();
    return mockDeviceStatusChart;
  },
  getAlertTrendChart: async () => {
    await delay();
    return mockAlertTrendChart;
  },
  getPerformanceChart: async () => {
    await delay();
    return mockPerformanceChart;
  },
  getDeviceTypeChart: async () => {
    await delay();
    return mockDeviceTypeChart;
  },
};

// ─── Permissions (read-only) ──────────────────────────────────────────────────
export const mockPermissionApi = {
  list: async () => {
    await delay();
    return mockPermissions;
  },
};