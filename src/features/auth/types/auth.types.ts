import { z } from 'zod';
import {
  loginRequestSchema,
  refreshTokenRequestSchema,
  selectCompanyRequestSchema,
  forgotPasswordRequestSchema,
  verifyOtpRequestSchema,
  resetPasswordRequestSchema,
  loginResponseDataSchema,
  tokenDataSchema,
  companySchema,
  verifyOtpResponseDataSchema,
} from '../schemas/auth.schema';

// ─── Inferred from Zod (single source of truth) ───────────────────────────────

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type SelectCompanyRequest = z.infer<typeof selectCompanyRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export type TokenData = z.infer<typeof tokenDataSchema>;
export type Company = z.infer<typeof companySchema>;
export type LoginResponseData = z.infer<typeof loginResponseDataSchema>;
export type RefreshTokenResponseData = TokenData;
export type SelectCompanyResponseData = TokenData;
export type VerifyOtpResponseData = z.infer<typeof verifyOtpResponseDataSchema>;

// ─── Session / UI types ───────────────────────────────────────────────────────

export interface AuthUser {
  userId: number;
  companyId: number;
  companyName: string;
  roleId: number;
  roleName: string;
}

// Legacy aliases kept for backward compatibility
export type SignInRequest = LoginRequest;
export interface SignInResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
