export interface EmployeeDeduction {
  id: number;
  employeeId: number;
  companyId: number;
  deductionType: string;
  documentNumber: string;
  startDate: string;
  endDate: string;
  isPercentage: boolean;
  amount: number;
  totalAmount: number;
  description: string;
  isActive: boolean;
  isPaid: boolean;
  fileId: number;
}

export interface CreateEmployeeDeductionDto {
  employeeId: number;
  companyId: number;
  deductionType: string;
  documentNumber: string;
  startDate: string;
  endDate: string;
  isPercentage: boolean;
  amount: number;
  totalAmount: number;
  description: string;
  isActive: boolean;
  isPaid: boolean;
  fileId: number;
}

export interface UpdateEmployeeDeductionDto extends CreateEmployeeDeductionDto {
  id: number;
}

export function toInputDate(value?: string | null): string {
  if (!value) return '';
  return value.split('T')[0] ?? '';
}

export function toApiDate(value: string): string {
  if (!value) return '';
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}
