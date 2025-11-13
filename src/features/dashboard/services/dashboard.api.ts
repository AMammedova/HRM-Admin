import { DashboardData } from '../types/dashboard.types';

// Mock data for dashboard
const mockDashboardData: DashboardData = {
  stats: {
    totalEmployees: 247,
    activeProjects: 12,
    pendingRequests: 8,
    completedTasks: 156,
    monthlyGrowth: 12.5,
  },
  monthlyData: [
    { name: 'Jan', value: 3500 },
    { name: 'Feb', value: 3800 },
    { name: 'Mar', value: 3622 },
    { name: 'Apr', value: 4100 },
    { name: 'May', value: 4500 },
    { name: 'Jun', value: 4800 },
  ],
  departmentData: [
    { name: 'IT', value: 45 },
    { name: 'HR', value: 28 },
    { name: 'Sales', value: 67 },
    { name: 'Marketing', value: 34 },
    { name: 'Finance', value: 23 },
    { name: 'Operations', value: 50 },
  ],
  recentActivities: [
    {
      id: '1',
      user: 'Aysel Məmmədova',
      action: 'Created new employee record',
      timestamp: '2024-10-30T10:30:00.000Z',
      type: 'success',
    },
    {
      id: '2',
      user: 'Elvin Həsənov',
      action: 'Updated department structure',
      timestamp: '2024-10-30T10:20:00.000Z',
      type: 'info',
    },
    {
      id: '3',
      user: 'Nigar Əliyeva',
      action: 'Approved leave request',
      timestamp: '2024-10-30T10:00:00.000Z',
      type: 'success',
    },
    {
      id: '4',
      user: 'Rəşad Quliyev',
      action: 'Pending approval required',
      timestamp: '2024-10-30T09:45:00.000Z',
      type: 'warning',
    },
    {
      id: '5',
      user: 'Leyla Məmmədova',
      action: 'Completed training module',
      timestamp: '2024-10-30T09:30:00.000Z',
      type: 'success',
    },
  ],
};

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDashboardData;
  },
};

