import { PaginatedResponse, QueryParams } from '@/shared/types/api';
import { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Aysel',
    lastName: 'Məmmədova',
    email: 'aysel.mammadova@hrm.az',
    phone: '+994501234567',
    role: 'HR Manager',
    department: 'Human Resources',
    position: 'Senior Manager',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    firstName: 'Elvin',
    lastName: 'Həsənov',
    email: 'elvin.hasanov@hrm.az',
    phone: '+994502345678',
    role: 'Developer',
    department: 'IT',
    position: 'Senior Developer',
    status: 'active',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    firstName: 'Nigar',
    lastName: 'Əliyeva',
    email: 'nigar.aliyeva@hrm.az',
    phone: '+994503456789',
    role: 'Sales Manager',
    department: 'Sales',
    position: 'Manager',
    status: 'active',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    firstName: 'Rəşad',
    lastName: 'Quliyev',
    email: 'rashad.quliyev@hrm.az',
    phone: '+994504567890',
    role: 'Marketing Specialist',
    department: 'Marketing',
    position: 'Specialist',
    status: 'active',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '5',
    firstName: 'Leyla',
    lastName: 'Məmmədova',
    email: 'leyla.mammadova@hrm.az',
    phone: '+994505678901',
    role: 'Accountant',
    department: 'Finance',
    position: 'Senior Accountant',
    status: 'inactive',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
];

const usersData = [...mockUsers];

export const usersApi = {
  list: async (params: QueryParams = {}): Promise<PaginatedResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredUsers = [...usersData];

    // Search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (params.status) {
      filteredUsers = filteredUsers.filter((user) => user.status === params.status);
    }

    // Sort
    if (params.sortBy) {
      filteredUsers.sort((a, b) => {
        const aVal = a[params.sortBy as keyof User] as string | number;
        const bVal = b[params.sortBy as keyof User] as string | number;
        const modifier = params.sortOrder === 'desc' ? -1 : 1;
        
        if (aVal < bVal) return -1 * modifier;
        if (aVal > bVal) return 1 * modifier;
        return 0;
      });
    }

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: filteredUsers.slice(start, end),
      pagination: {
        page,
        pageSize,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / pageSize),
      },
    };
  },

  getById: async (id: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = usersData.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersData.push(newUser);
    return newUser;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = usersData.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    usersData[index] = {
      ...usersData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return usersData[index];
  },

  remove: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = usersData.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    usersData.splice(index, 1);
  },
};

