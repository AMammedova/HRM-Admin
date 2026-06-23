import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  CreateEmployeeDto,
  Employee,
  EmployeeDetail,
  EmployeeDropdownItem,
  EmployeeListItem,
  EmployeesListData,
  EmployeesQueryParams,
  UpdateEmployeeDto,
} from '../types/employee.types';

export const employeesApi = {
  list: async (
    companyId: number,
    params: EmployeesQueryParams
  ): Promise<PaginatedResponse<EmployeeListItem>> => {
    const { data } = await apiClient.get<BackendResponse<EmployeesListData>>(
      `/panel/companies/${companyId}/employees`,
      {
        params: {
          CompanyId: companyId,
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
        },
      }
    );

    return {
      data: data.data.items,
      pagination: {
        page: data.data.pageNumber,
        pageSize: params.pageSize ?? 10,
        total: data.data.totalCount,
        totalPages: data.data.totalPages,
      },
    };
  },

  getAll: async (companyId: number, search?: string): Promise<EmployeeDropdownItem[]> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeDropdownItem[]>>(
      `/panel/companies/${companyId}/employees/all`,
      {
        params: {
          search: search || undefined,
        },
      }
    );
    return data.data;
  },

  getById: async (companyId: number, id: number): Promise<Employee> => {
    const { data } = await apiClient.get<BackendResponse<Employee>>(
      `/panel/companies/${companyId}/employees/${id}`
    );
    return data.data;
  },

  getDetail: async (companyId: number, id: number): Promise<EmployeeDetail> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeDetail>>(
      `/panel/companies/${companyId}/employees/${id}/detail`
    );
    return data.data;
  },

  getAnket: async (companyId: number, id: number): Promise<unknown> => {
    const { data } = await apiClient.get<BackendResponse<unknown>>(
      `/panel/companies/${companyId}/employees/${id}/anket`
    );
    return data.data;
  },

  create: async (companyId: number, payload: CreateEmployeeDto): Promise<Employee> => {
    const { data } = await apiClient.post<BackendResponse<Employee>>(
      `/panel/companies/${companyId}/employees`,
      payload
    );
    return data.data;
  },

  update: async (companyId: number, id: number, payload: UpdateEmployeeDto): Promise<Employee> => {
    const { data } = await apiClient.put<BackendResponse<Employee>>(
      `/panel/companies/${companyId}/employees/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/employees/${id}`);
  },
};
