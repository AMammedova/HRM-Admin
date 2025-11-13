export interface OrgNode {
  id: string;
  name: string;
  title: string;
  children?: OrgNode[];
  parentId?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  children?: Department[];
}

export interface OrganizationStructure {
  company: {
    id: string;
    name: string;
    description?: string;
  };
  departments: Department[];
  employees: {
    id: string;
    name: string;
    position: string;
    departmentId: string;
    avatar?: string;
  }[];
}

