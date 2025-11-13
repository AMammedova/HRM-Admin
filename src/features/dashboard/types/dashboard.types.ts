export interface DashboardStats {
  totalEmployees: number;
  activeProjects: number;
  pendingRequests: number;
  completedTasks: number;
  monthlyGrowth: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface DashboardData {
  stats: DashboardStats;
  monthlyData: ChartDataPoint[];
  departmentData: ChartDataPoint[];
  recentActivities: RecentActivity[];
}

