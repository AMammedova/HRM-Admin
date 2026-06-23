export interface EmployeeDocument {
  id: number;
  employeeId: number;
  companyId: number;
  documentCode: string;
  hasBeenPresented: boolean;
  fileId?: number;
}

export interface CreateEmployeeDocumentDto {
  employeeId: number;
  companyId: number;
  documentCode: string;
  hasBeenPresented: boolean;
}

export interface UpdateEmployeeDocumentDto extends CreateEmployeeDocumentDto {
  id: number;
}
