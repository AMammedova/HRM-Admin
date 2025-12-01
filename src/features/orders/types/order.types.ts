import { Entity } from '@/shared/types/id';

export interface Order extends Entity {
  orderNumber: string;
  finCode: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  contractEndDate: string;
  structure: string;
  position: string;
  branch: string;
}

export interface CreateOrderDto {
  orderNumber: string;
  finCode: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  contractEndDate: string;
  structure: string;
  position: string;
  branch: string;
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {}


