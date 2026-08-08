import type {
  User, Role, Permission, Team, Tenant, Device, DeviceMetrics, DeviceLog,
  Alert, AlertComment, Command, AIHealthScore, AIRecommendation, AIPrediction,
  AuditLog, Report, Notification, PaginatedResponse,
} from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = new Date();
const iso = (daysAgo = 0, hoursAgo = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[rand(0, arr.length - 1)];

// ─── Permissions ──────────────────────────────────────────────────────────────
export const mockPermissions: Permission[] = [
  { id: 'p1', name: 'device:read', description: 'View devices', module: 'Devices', assignedRolesCount: 5 },
  { id: 'p2', name: 'device:write', description: 'Create and edit devices', module: 'Devices', assignedRolesCount: 3 },
  { id: 'p3', name: 'device:delete', description: 'Delete devices', module: 'Devices', assignedRolesCount: 2 },
  { id: 'p4', name: 'device:command', description: 'Send commands to devices', module: 'Devices', assignedRolesCount: 3 },
  { id: 'p5', name: 'user:read', description: 'View users', module: 'Users', assignedRolesCount: 4 },
  { id: 'p6', name: 'user:write', description: 'Create and edit users', module: 'Users', assignedRolesCount: 3 },
  { id: 'p7', name: 'user:delete', description: 'Delete users', module: 'Users', assignedRolesCount: 1 },
  { id: 'p8', name: 'tenant:read', description: 'View tenants', module: 'Tenants', assignedRolesCount: 2 },
  { id: 'p9', name: 'tenant:write', description: 'Create and edit tenants', module: 'Tenants', assignedRolesCount: 1 },
  { id: 'p10', name: 'alert:read', description: 'View alerts', module: 'Alerts', assignedRolesCount: 5 },
  { id: 'p11', name: 'alert:acknowledge', description: 'Acknowledge alerts', module: 'Alerts', assignedRolesCount: 3 },
  { id: 'p12', name: 'alert:resolve', description: 'Resolve alerts', module: 'Alerts', assignedRolesCount: 2 },
  { id: 'p13', name: 'report:read', description: 'View reports', module: 'Reports', assignedRolesCount: 5 },
  { id: 'p14', name: 'report:generate', description: 'Generate reports', module: 'Reports', assignedRolesCount: 3 },
  { id: 'p15', name: 'audit:read', description: 'View audit logs', module: 'Admin', assignedRolesCount: 1 },
  { id: 'p16', name: 'role:read', description: 'View roles', module: 'Roles', assignedRolesCount: 4 },
  { id: 'p17', name: 'role:write', description: 'Create and edit roles', module: 'Roles', assignedRolesCount: 2 },
  { id: 'p18', name: 'team:read', description: 'View teams', module: 'Teams', assignedRolesCount: 4 },
  { id: 'p19', name: 'team:write', description: 'Create and edit teams', module: 'Teams', assignedRolesCount: 2 },
  { id: 'p20', name: 'settings:read', description: 'View settings', module: 'Settings', assignedRolesCount: 5 },
  { id: 'p21', name: 'settings:write', description: 'Edit settings', module: 'Settings', assignedRolesCount: 2 },
];

// ─── Roles ────────────────────────────────────────────────────────────────────
export const mockRoles: Role[] = [
  { id: 'r1', name: 'PLATFORM_ADMIN', description: 'Full platform access', permissions: mockPermissions, userCount: 2, isSystemRole: true, createdAt: iso(120) },
  { id: 'r2', name: 'TENANT_ADMIN', description: 'Tenant-level administration', permissions: mockPermissions.filter(p => !p.name.startsWith('tenant:')), userCount: 8, isSystemRole: true, createdAt: iso(120) },
  { id: 'r3', name: 'EMBEDDED_ENGINEER', description: 'Device management and configuration', permissions: mockPermissions.filter(p => p.module === 'Devices' || p.name === 'alert:read' || p.name === 'report:read'), userCount: 15, isSystemRole: true, createdAt: iso(120) },
  { id: 'r4', name: 'OPERATOR', description: 'Monitor and respond to alerts', permissions: mockPermissions.filter(p => p.module === 'Alerts' || p.name === 'device:read' || p.name === 'report:read'), userCount: 24, isSystemRole: true, createdAt: iso(120) },
  { id: 'r5', name: 'VIEWER', description: 'Read-only access', permissions: mockPermissions.filter(p => p.name.endsWith(':read')), userCount: 45, isSystemRole: true, createdAt: iso(120) },
  { id: 'r6', name: 'CUSTOM_MAINTAINER', description: 'Custom maintenance role', permissions: mockPermissions.filter(p => p.module === 'Devices'), userCount: 5, isSystemRole: false, createdAt: iso(30) },
];

// ─── Teams ────────────────────────────────────────────────────────────────────
export const mockTeams: Team[] = [
  { id: 't1', name: 'Core Infrastructure', description: 'Core platform infrastructure team', tenantId: 'tenant1', teamLeaderId: 'u3', teamLeaderName: 'Mike Chen', userNumber: 8, deviceCount: 24, createdAt: iso(90) },
  { id: 't2', name: 'IoT Sensors', description: 'IoT sensor array management', tenantId: 'tenant1', teamLeaderId: 'u4', teamLeaderName: 'Sarah Johnson', userNumber: 6, deviceCount: 45, createdAt: iso(85) },
  { id: 't3', name: 'Network Operations', description: 'Network and gateway management', tenantId: 'tenant1', teamLeaderId: 'u5', teamLeaderName: 'David Wilson', userNumber: 5, deviceCount: 12, createdAt: iso(80) },
  { id: 't4', name: 'Field Engineering', description: 'On-site device deployment', tenantId: 'tenant1', teamLeaderId: 'u6', teamLeaderName: 'Lisa Anderson', userNumber: 10, deviceCount: 30, createdAt: iso(60) },
  { id: 't5', name: 'Security Team', description: 'Security monitoring and response', tenantId: 'tenant1', teamLeaderId: 'u7', teamLeaderName: 'Robert Garcia', userNumber: 4, deviceCount: 8, createdAt: iso(45) },
  { id: 't6', name: 'QA Team', description: 'Quality assurance and testing', tenantId: 'tenant2', teamLeaderId: 'u8', teamLeaderName: 'Emily Brown', userNumber: 7, deviceCount: 15, createdAt: iso(40) },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', firstName: 'Admin', lastName: 'Platform', email: 'admin@platform.com', username: 'platform_admin', status: 'ACTIVE', role: mockRoles[0], team: mockTeams[0], tenantId: 'tenant1', tenantName: 'Platform Inc', lastLogin: iso(0, 2), createdAt: iso(120), updatedAt: iso(0, 2), phone: '+1-555-0001', mustChangePassword: false },
 ];

// ─── Tenants ──────────────────────────────────────────────────────────────────
export const mockTenants: Tenant[] = [
 ];

// ─── Devices ──────────────────────────────────────────────────────────────────
const deviceTypes = ['SENSOR', 'GATEWAY', 'CONTROLLER', 'SENSOR_ARRAY', 'ACTUATOR', 'CAMERA'] as const;
const deviceStatuses = ['ONLINE', 'OFFLINE', 'WARNING', 'ERROR'] as const;
const locations = ['Building A - Floor 1', 'Building A - Floor 2', 'Building B - Floor 1', 'Server Room', 'Warehouse', 'Outdoor North', 'Outdoor South', 'Lab Room 101', 'Lab Room 102', 'Data Center'];



export const mockDevices: Device[] = Array.from({ length: 30 }, (_, i) => {
  const type = deviceTypes[i % deviceTypes.length];
  const status = i < 20 ? 'ONLINE' : i < 25 ? 'WARNING' : i < 28 ? 'OFFLINE' : 'ERROR';
  return {
    id: `d${i + 1}`,
    name: `${type.charAt(0) + type.slice(1).toLowerCase()} ${String(i + 1).padStart(3, '0')}`,
    deviceId: `DEV-${String(i + 1).padStart(4, '0')}`,
    type,
    ipAddress: `10.0.${Math.floor(i / 10)}.${i % 10 + 1}`,
    status,
    location: locations[i % locations.length],
    teamId: `t${(i % 6) + 1}`,
    teamName: mockTeams[i % 6].name,
    description: `${type} device for monitoring and control`,
    firmwareVersion: `v${1 + Math.floor(i / 10)}.${i % 5}.${i % 3}`,
    metadata: { manufacturer: pick(['Siemens', 'Schneider', 'ABB', 'Honeywell']), model: `Model-${i + 1}` },
    lastSeen: status === 'OFFLINE' ? iso(rand(1, 5)) : iso(0, rand(0, 3)),
    createdAt: iso(rand(10, 90)),
    updatedAt: iso(rand(0, 5)),
    assignedUserId: pick(mockUsers).id,
    deviceName: `${type.charAt(0) + type.slice(1).toLowerCase()} ${String(i + 1).padStart(3, '0')}`,
    hostname: `device-${i + 1}.example.com`,
    macAddress: `00:1A:C2:9B:${String(i + 1).padStart(2, '0')}:FF`,
    manufacturer: pick(['Siemens', 'Schneider', 'ABB', 'Honeywell']),
    model: `Model-${i + 1}`,
    tenantId: 'tenant1',
  };
});

// ─── Device Metrics ───────────────────────────────────────────────────────────
export const mockDeviceMetrics: DeviceMetrics[] = mockDevices.slice(0, 10).map((d, i) => ({
  deviceId: d.id,
  timestamp: iso(0, 0),
  cpu: rand(15, 85),
  ram: rand(30, 90),
  disk: rand(20, 75),
  network: rand(10, 95),
  temperature: rand(35, 78),
  uptime: rand(1, 720), // hours
}));

// ─── Device Logs ──────────────────────────────────────────────────────────────
const logMessages = [
  'Device started successfully',
  'Configuration updated',
  'Heartbeat received',
  'Temperature threshold warning',
  'Network connection re-established',
  'Firmware update completed',
  'Sensor calibration completed',
  'Memory usage above 80%',
  'Command executed: restart_service',
  'Diagnostic check passed',
];
export const mockDeviceLogs: DeviceLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log${i + 1}`,
  deviceId: `d${(i % 10) + 1}`,
  timestamp: iso(rand(0, 7), rand(0, 23)),
  level: pick(['INFO', 'WARN', 'ERROR', 'DEBUG'] as const),
  message: logMessages[i % logMessages.length],
  source: pick(['system', 'network', 'sensor', 'firmware']),
  metadata: i % 3 === 0 ? { code: rand(100, 999) } : undefined,
}));

// ─── Alerts ───────────────────────────────────────────────────────────────────
const alertMessages = [
  'CPU temperature exceeds 90°C',
  'Memory usage above 85%',
  'Device offline - no heartbeat',
  'Disk space below 10%',
  'Network latency above 500ms',
  'Firmware version outdated',
  'Sensor reading out of range',
  'Power supply voltage drop',
  'Authentication failure detected',
  'Service crash detected',
];
export const mockAlerts: Alert[] = Array.from({ length: 20 }, (_, i) => {
  const severity = i < 5 ? 'CRITICAL' : i < 12 ? 'WARNING' : 'INFO';
  const status = i < 8 ? 'ACTIVE' : i < 14 ? 'ACKNOWLEDGED' : i < 18 ? 'RESOLVED' : 'ESCALATED';
  const device = mockDevices[i % mockDevices.length];
  return {
    id: `a${i + 1}`,
    severity: severity as Alert['severity'],
    status: status as Alert['status'],
    deviceId: device.id,
    deviceName: device.deviceName,
    deviceLocation: device.location,
    message: alertMessages[i % alertMessages.length],
    timestamp: iso(rand(0, 10), rand(0, 23)),
    acknowledgedBy: status !== 'ACTIVE' ? pick(mockUsers).username : undefined,
    acknowledgedAt: status !== 'ACTIVE' ? iso(rand(0, 5)) : undefined,
    assignedTo: status === 'ESCALATED' ? pick(mockUsers).username : undefined,
    resolvedBy: status === 'RESOLVED' ? pick(mockUsers).username : undefined,
    resolvedAt: status === 'RESOLVED' ? iso(rand(0, 3)) : undefined,
    comments: i < 5 ? [{
      id: `c${i + 1}`,
      userId: 'u3',
      userName: 'Mike Chen',
      text: 'Investigating the issue now.',
      timestamp: iso(rand(0, 2)),
    }] : [],
    relatedAlerts: i < 3 ? [`a${i + 2}`, `a${i + 3}`] : [],
  };
});

// ─── Commands ─────────────────────────────────────────────────────────────────
export const mockCommands: Command[] = Array.from({ length: 15 }, (_, i) => {
  const device = mockDevices[i % mockDevices.length];
  const status = i < 8 ? 'SUCCESS' : i < 11 ? 'FAILED' : i < 13 ? 'EXECUTING' : i < 14 ? 'PENDING' : 'CANCELLED';
  return {
    id: `cmd${i + 1}`,
    deviceId: device.id,
    deviceName: device.deviceName,
    commandType: pick(['RESTART_SERVICE', 'CLEAR_CACHE', 'UPDATE_CONFIG', 'RUN_DIAGNOSTIC', 'CUSTOM', 'FIRMWARE_UPDATE'] as const),
    parameters: { timeout: 30, force: i % 2 === 0 },
    status: status as Command['status'],
    initiatedBy: pick(mockUsers).username,
    timestamp: iso(rand(0, 5), rand(0, 23)),
    duration: status === 'SUCCESS' ? rand(1, 30) : undefined,
    result: status === 'SUCCESS' ? 'Command completed successfully' : undefined,
    error: status === 'FAILED' ? 'Connection timeout' : undefined,
  };
});

// ─── AI Data ──────────────────────────────────────────────────────────────────
export const mockAIHealthScore: AIHealthScore = {
  overall: 78,
  categories: { deviceHealth: 82, performance: 75, security: 88, reliability: 70 },
};

export const mockAIRecommendations: AIRecommendation[] = [
  { id: 'rec1', priority: 'HIGH', type: 'PERFORMANCE', title: 'Optimize CPU usage on Sensor 003', description: 'CPU usage consistently above 80% may cause performance degradation.', impact: 'Improved response time by 30%', action: 'Schedule firmware update and redistribute load', deviceIds: ['d3'], estimatedSavings: 15, createdAt: iso(1) },
  { id: 'rec2', priority: 'HIGH', type: 'SECURITY', title: 'Update outdated firmware on 5 devices', description: 'Several devices are running firmware with known vulnerabilities.', impact: 'Reduced security risk by 60%', action: 'Schedule firmware update during maintenance window', deviceIds: ['d5', 'd8', 'd12', 'd15', 'd20'], estimatedSavings: 0, createdAt: iso(2) },
  { id: 'rec3', priority: 'MEDIUM', type: 'RELIABILITY', title: 'Replace aging Gateway 002', description: 'Gateway 002 has been running for 720+ days and shows signs of degradation.', impact: 'Prevent potential downtime', action: 'Plan hardware replacement within 30 days', deviceIds: ['d2'], estimatedSavings: 25, createdAt: iso(3) },
  { id: 'rec4', priority: 'MEDIUM', type: 'PERFORMANCE', title: 'Load balance network traffic', description: 'Network traffic is unevenly distributed across gateways.', impact: '20% improvement in network throughput', action: 'Reconfigure device-to-gateway assignments', estimatedSavings: 10, createdAt: iso(5) },
  { id: 'rec5', priority: 'LOW', type: 'MAINTENANCE', title: 'Schedule routine sensor calibration', description: '8 sensors are due for calibration based on usage patterns.', impact: 'Maintain data accuracy', action: 'Create calibration schedule for next week', deviceIds: ['d1', 'd6', 'd11', 'd16'], createdAt: iso(7) },
];

export const mockAIPredictions: AIPrediction[] = [
  { id: 'pred1', deviceId: 'd3', deviceName: 'Sensor 003', type: 'FAILURE', prediction: 'CPU failure likely within 7 days', confidence: 87, estimatedTime: '7 days', recommendedAction: 'Replace CPU module or schedule maintenance', createdAt: iso(1) },
  { id: 'pred2', deviceId: 'd7', deviceName: 'Gateway 007', type: 'DEGRADATION', prediction: 'Network performance degradation expected', confidence: 72, estimatedTime: '3 days', recommendedAction: 'Check network configuration and bandwidth', createdAt: iso(2) },
  { id: 'pred3', deviceId: 'd10', deviceName: 'Controller 010', type: 'MAINTENANCE', prediction: 'Firmware update recommended', confidence: 95, estimatedTime: '14 days', recommendedAction: 'Schedule firmware update to v2.1.0', createdAt: iso(0, 5) },
  { id: 'pred4', deviceId: 'd15', deviceName: 'Sensor Array 015', type: 'FAILURE', prediction: 'Disk failure predicted within 30 days', confidence: 81, estimatedTime: '30 days', recommendedAction: 'Replace storage module', createdAt: iso(3) },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────
const auditActions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'CONFIG_CHANGE'];
const auditResources = ['User', 'Tenant', 'Device', 'Role', 'Team', 'Alert', 'Report', 'Settings'];
// export const mockAuditLogs: AuditLog[] = Array.from({ length: 30 }, (_, i) => {
//   const user = mockUsers[i % mockUsers.length];
//   const action = auditActions[i % auditActions.length];
//   const resource = auditResources[i % auditResources.length];
//   return {
//     id: `audit${i + 1}`,
//     timestamp: iso(rand(0, 14), rand(0, 23)),
//     userId: user.id,
//     userName: `${user.firstName} ${user.lastName}`,
//     action,
//     resourceType: resource,
//     resourceId: `${resource.toLowerCase()}-${rand(1, 100)}`,
//     changes: action === 'UPDATE' ? { before: { status: 'ACTIVE' }, after: { status: 'INACTIVE' } } : undefined,
//     ipAddress: `192.168.${rand(1, 10)}.${rand(1, 50)}`,
//     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
//   };
// });

// ─── Reports ──────────────────────────────────────────────────────────────────
export const mockReports: Report[] = Array.from({ length: 12 }, (_, i) => ({
  id: `rep${i + 1}`,
  name: `${pick(['Device Inventory', 'Device Health', 'Performance', 'Incident', 'AI Analysis'])} Report - ${iso(rand(0, 30)).split('T')[0]}`,
  type: pick(['DEVICE_INVENTORY', 'DEVICE_HEALTH', 'PERFORMANCE', 'INCIDENT', 'AI_ANALYSIS'] as const),
  format: pick(['PDF', 'EXCEL', 'CSV', 'JSON'] as const),
  generatedBy: pick(mockUsers).username,
  generatedAt: iso(rand(0, 30), rand(0, 23)),
  downloadUrl: `/api/reports/${i + 1}/download`,
  parameters: { dateRange: '30d', tenantId: 'tenant2' },
}));

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [

];

// ─── Dashboard Chart Data ─────────────────────────────────────────────────────
export const mockDeviceStatusChart = [
  { name: 'Online', value: 20, color: '#22c55e' },
  { name: 'Warning', value: 5, color: '#f59e0b' },
  { name: 'Offline', value: 3, color: '#6b7280' },
  { name: 'Error', value: 2, color: '#ef4444' },
];

export const mockAlertTrendChart = Array.from({ length: 7 }, (_, i) => ({
  name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  critical: rand(1, 5),
  warning: rand(3, 10),
  info: rand(5, 15),
}));

export const mockPerformanceChart = Array.from({ length: 12 }, (_, i) => ({
  name: `Hour ${i + 1}`,
  cpu: rand(20, 80),
  memory: rand(30, 85),
  network: rand(10, 70),
}));

export const mockDeviceTypeChart = [
  { name: 'Sensor', value: 12, color: '#3b82f6' },
  { name: 'Gateway', value: 5, color: '#8b5cf6' },
  { name: 'Controller', value: 4, color: '#ec4899' },
  { name: 'Sensor Array', value: 5, color: '#f59e0b' },
  { name: 'Actuator', value: 2, color: '#10b981' },
  { name: 'Camera', value: 2, color: '#6b7280' },
];

// ─── Paginated Response Helper ────────────────────────────────────────────────
export function paginate<T>(data: T[], page = 0, size = 20): PaginatedResponse<T> {
  const start = page * size;
  const content = data.slice(start, start + size);
  const totalElements = data.length;
  const totalPages = Math.ceil(totalElements / size);
  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}