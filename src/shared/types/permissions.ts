/**
 * All known permissions returned by /panel/auth/my-permissions
 * Pattern: "{Module}.{Action}"
 */
export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'Dashboard.View',
  },
  EMPLOYEES: {
    VIEW: 'Employees.View',
    CREATE: 'Employees.Create',
    EDIT: 'Employees.Edit',
    DELETE: 'Employees.Delete',
  },
  CONTRACTS: {
    VIEW: 'Contracts.View',
    CREATE: 'Contracts.Create',
    EDIT: 'Contracts.Edit',
    DELETE: 'Contracts.Delete',
  },
  ORDERS: {
    VIEW: 'Orders.View',
    CREATE: 'Orders.Create',
    EDIT: 'Orders.Edit',
    DELETE: 'Orders.Delete',
  },
  USERS: {
    VIEW: 'Users.View',
    CREATE: 'Users.Create',
    EDIT: 'Users.Edit',
    DELETE: 'Users.Delete',
  },
  COMPANIES: {
    VIEW: 'Companies.View',
    CREATE: 'Companies.Create',
    EDIT: 'Companies.Edit',
    DELETE: 'Companies.Delete',
  },
  EXPLANATIONS: {
    VIEW: 'Explanations.View',
    CREATE: 'Explanations.Create',
  },
  ANNOUNCEMENTS: {
    VIEW: 'Announcements.View',
    CREATE: 'Announcements.Create',
  },
  STRUCTURE: {
    VIEW: 'Structure.View',
  },
  ATTENDANCE: {
    VIEW: 'Attendance.View',
  },
  SETTINGS: {
    VIEW: 'Settings.View',
  },
} as const;

type PermissionGroup = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type Permission = PermissionGroup[keyof PermissionGroup];
