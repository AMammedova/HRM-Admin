export interface BankTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
  description: string;
}

export interface BankListItem extends Record<string, unknown> {
  id: number;
  companyId: number;
  code: string;
  name: string;
  taxId: string;
  swiftCode: string;
  isActive: boolean;
}

export interface Bank {
  id: number;
  companyId: number;
  code: string;
  taxId: string;
  address: string;
  swiftCode: string;
  correspondentAccount: string;
  settlementAccount: string;
  isActive: boolean;
  translations: BankTranslation[];
}

export interface CreateBankDto {
  companyId: number;
  code: string;
  taxId: string;
  address: string;
  swiftCode: string;
  correspondentAccount: string;
  settlementAccount: string;
  isActive: boolean;
  translations: BankTranslation[];
}

export interface UpdateBankDto extends CreateBankDto {
  id: number;
}

export interface BanksListData {
  items: BankListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BanksQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface BankDropdownItem {
  id: number;
  code: string;
  name: string;
}
