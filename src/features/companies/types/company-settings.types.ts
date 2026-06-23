export interface CompanySettings {
  companyId: number;
  isManualOvertimeEnabled: boolean;
  isAutoEmployeeCodeEnabled: boolean;
  employeeCodeSymbolSize: number;
  isTimesheetExternalFileEnabled: boolean;
  isServiceChargeEnabled: boolean;
  isVacationAutoProlongEnabled: boolean;
  isVacationIndexEnabled: boolean;
  isWorkingTimeEnabled: boolean;
}

export type UpsertCompanySettingsDto = CompanySettings;

export function defaultCompanySettings(companyId: number): CompanySettings {
  return {
    companyId,
    isManualOvertimeEnabled: false,
    isAutoEmployeeCodeEnabled: true,
    employeeCodeSymbolSize: 3,
    isTimesheetExternalFileEnabled: false,
    isServiceChargeEnabled: true,
    isVacationAutoProlongEnabled: false,
    isVacationIndexEnabled: true,
    isWorkingTimeEnabled: true,
  };
}
