import { z } from 'zod';

// ─── Request schemas ──────────────────────────────────────────────────────────

export const loginRequestSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  password: z.string().min(1, 'auth.passwordRequired'),
});

export const refreshTokenRequestSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const selectCompanyRequestSchema = z.object({
  userId: z.number(),
  companyId: z.number(),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
});

export const verifyOtpRequestSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  otp: z
    .string()
    .min(1, 'auth.otpRequired')
    .length(6, 'auth.otpLength')
    .regex(/^\d+$/, 'auth.otpDigitsOnly'),
});

const resetPasswordFieldsSchema = z.object({
  newPassword: z.string().min(6, 'auth.passwordMin'),
  confirmPassword: z.string().min(1, 'auth.confirmPasswordRequired'),
});

export const resetPasswordFormSchema = resetPasswordFieldsSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'auth.passwordMismatch',
    path: ['confirmPassword'],
  }
);

export const resetPasswordRequestSchema = resetPasswordFieldsSchema
  .extend({ resetToken: z.string().min(1) })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'auth.passwordMismatch',
    path: ['confirmPassword'],
  });

// ─── Response schemas ─────────────────────────────────────────────────────────

export const tokenDataSchema = z.object({
  token: z.string(),
  expiration: z.string(),
  refreshToken: z.string(),
  refreshTokenLifeTime: z.number(),
});

export const companySchema = z.object({
  companyId: z.number(),
  companyName: z.string(),
  roleId: z.number(),
  roleName: z.string(),
});

export const loginResponseDataSchema = z.object({
  requiresCompanySelection: z.boolean(),
  token: tokenDataSchema,
  companies: z.array(companySchema),
  userId: z.number(),
});

export const refreshTokenResponseDataSchema = tokenDataSchema;
export const selectCompanyResponseDataSchema = tokenDataSchema;

export const verifyOtpResponseDataSchema = z.object({
  resetToken: z.string(),
});

// ─── Form schema aliases (used by react-hook-form) ────────────────────────────
export const signInSchema = loginRequestSchema;
export type SignInFormData = z.infer<typeof signInSchema>;

export const forgotPasswordFormSchema = forgotPasswordRequestSchema;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export const verifyOtpFormSchema = verifyOtpRequestSchema;
export type VerifyOtpFormData = z.infer<typeof verifyOtpFormSchema>;

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
