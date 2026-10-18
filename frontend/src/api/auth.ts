import { apiPost } from "./api";
import { type LoginRequest, type LoginResponse } from "../utils/types";

export async function login(email: string, password: string) {
  const body: LoginRequest = {
    email,
    password,
  };

  return apiPost<LoginRequest, LoginResponse>("/login", body);
}
