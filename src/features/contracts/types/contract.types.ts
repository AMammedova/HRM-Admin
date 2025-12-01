import { Entity } from '@/shared/types/id';

export interface Contract extends Entity {
  contractNumber: string;
  finCode: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  structure: string;
  position: string;
  branch: string;
  status?: 'active' | 'expired' | 'terminated';
}

export interface CreateContractDto {
  contractNumber: string;
  finCode: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  structure: string;
  position: string;
  branch: string;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {}


