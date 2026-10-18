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
