export type View = "overview" | "vault" | "generator" | "settings";
export type VaultItem = {
  title: string;
  username: string;
  category: string;
  color: string;
  initials: string;
};

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GeneratePasswordRequest {
  profile?: string;
  length?: number;
}

export interface GeneratePasswordResponse {
  password: string;
  profile: string;
  length: number;
}

export interface CreateLoginCredentialRequest {
  username: string;
  password: string;
  notes?: string | null;
}

export interface CreateSshKeyCredentialRequest {
  key: string;
  notes?: string | null;
}

export interface CreatePaymentCardCredentialRequest {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  notes?: string | null;
}

export interface LoginCredentialResponse {
  type: "login";
  credentialId: number;
  notes: string | null;
  username: string;
  password: string;
}

export interface SshKeyCredentialResponse {
  type: "ssh_key";
  credentialId: number;
  notes: string | null;
  key: string;
}

export interface PaymentCardCredentialResponse {
  type: "payment_card";
  credentialId: number;
  notes: string | null;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export type CredentialResponse =
  | LoginCredentialResponse
  | SshKeyCredentialResponse
  | PaymentCardCredentialResponse;
