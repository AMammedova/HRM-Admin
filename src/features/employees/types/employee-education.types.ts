export interface EmployeeEducation {
  id: number;
  employeeId: number;
  companyId: number;
  organizationCode: string;
  startDate: string;
  endDate: string;
  educationLevelLookupValueId: number;
  eduDocTypeLookupValueId: number;
  documentNumber: string;
  profession: string;
  fileId?: number;
}

export interface CreateEmployeeEducationDto {
  employeeId: number;
  companyId: number;
  organizationCode: string;
  startDate: string;
  endDate: string;
  educationLevelLookupValueId: number;
  eduDocTypeLookupValueId: number;
  documentNumber: string;
  profession: string;
}

export interface UpdateEmployeeEducationDto extends CreateEmployeeEducationDto {
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
