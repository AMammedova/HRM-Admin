import { Entity } from '@/shared/types/id';

export interface Employee extends Entity {
  code: string; // İşçi kodu (e.g., GRM112323)
  firstName: string;
  lastName: string;
  position: string; // Vəzifə
  branch: string; // Fillial
  fin: string; // FİN
  structure: string; // Struktur
  avatar?: string;
  email?: string;
  phone?: string;
  department?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  // Additional detail fields
  birthDate?: string;
  address?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  workStartDate?: string;
  contractType?: string;
  salary?: number;
  bankAccount?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  education?: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  workHistory?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
  }>;
}

export interface CreateEmployeeDto {
  code: string;
  firstName: string;
  lastName: string;
  position: string;
  branch: string;
  fin: string;
  structure: string;
  avatar?: string;
  email?: string;
  phone?: string;
  department?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

