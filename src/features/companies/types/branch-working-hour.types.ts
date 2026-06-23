export interface BranchWorkingHour {
  id: number;
  branchId: number;
  jobStartTime: string;
  jobEndTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  isActive: boolean;
}

export interface CreateBranchWorkingHourDto {
  companyId: number;
  branchId: number;
  jobStartTime: string;
  jobEndTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  isActive: boolean;
}

export interface UpdateBranchWorkingHourDto extends CreateBranchWorkingHourDto {
  id: number;
}

export function toApiTime(value: string): string {
  if (!value) return value;
  if (value.length === 5) return `${value}:00`;
  return value;
}

export function toInputTime(value: string): string {
  if (!value) return '';
  return value.slice(0, 5);
}
