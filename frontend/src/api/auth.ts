import { apiPost } from "./api";
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  User,
} from "../utils/types";

export async function login(email: string, password: string) {
  const body: LoginRequest = {
    email,
    password,
  };

  return apiPost<LoginRequest, LoginResponse>("/auth/login", body);
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  const body: RegisterRequest = {
    firstName,
    lastName,
    email,
    password,
  };

  return apiPost<RegisterRequest, User>("/user", body);
}
