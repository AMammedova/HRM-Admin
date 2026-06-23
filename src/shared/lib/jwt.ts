const COMPANY_ID_CLAIMS = ['companyId', 'CompanyId', 'company_id', 'CompanyID'] as const;

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getCompanyIdFromToken(token: string | null): number | null {
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  for (const claim of COMPANY_ID_CLAIMS) {
    const value = payload[claim];
    if (value !== undefined && value !== null) {
      const num = Number(value);
      if (!Number.isNaN(num) && num > 0) return num;
    }
  }

  return null;
}
