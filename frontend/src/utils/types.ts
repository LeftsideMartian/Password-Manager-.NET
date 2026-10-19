export type View = "overview" | "vault" | "generator" | "settings";
export type VaultItem = {
  credentialId: number;
  title: string;
  username: string;
  password: string;
  category: string;
  notes: string | null;
  color: string;
  initials: string;
};

export type LoginCredential = {
  type: "login";
  credentialId: number;
  name: string;
  category: string;
  notes: string | null;
  username: string;
  password: string;
};

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
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

export interface GeneratePasswordRequest {
  profile?: string;
  length?: number;
}

export interface GeneratePasswordResponse {
  password: string;
  profile: string;
  length: number;
}
