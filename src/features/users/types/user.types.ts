import { Entity } from '@/shared/types/id';

export interface User extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export type UserStatus = 'active' | 'inactive';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  position: string;
  status: UserStatus;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

