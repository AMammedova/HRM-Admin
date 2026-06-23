export interface EmployeeContact {
  employeeId: number;
  companyId: number;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  phone3: string;
  phone4: string;
  postIndex: string;
  regAddress: string;
  regAddress2: string;
  liveAddress: string;
  liveAddress2: string;
}

export interface UpsertEmployeeContactDto extends EmployeeContact {}

export function defaultEmployeeContact(
  companyId: number,
  employeeId: number
): EmployeeContact {
  return {
    companyId,
    employeeId,
    email1: '',
    email2: '',
    phone1: '',
    phone2: '',
    phone3: '',
    phone4: '',
    postIndex: '',
    regAddress: '',
    regAddress2: '',
    liveAddress: '',
    liveAddress2: '',
  };
}
