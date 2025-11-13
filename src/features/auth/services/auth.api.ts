import { SignInRequest, SignInResponse } from "../types/auth.types";

// src/features/auth/services/auth.api.ts
export const authApi = {
  signIn: async (credentials: SignInRequest): Promise<SignInResponse> => {
    // Mock implementation - will be replaced with real API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return {
      token: 'mock-token',
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
      },
    };
  },

  signOut: async (): Promise<void> => {
    // Will be implemented when API is ready
  },

  getCurrentUser: () => {
    // Will be implemented when API is ready
    return null;
  },

  setAuthData: () => {
    // Will be implemented when API is ready
  },
};