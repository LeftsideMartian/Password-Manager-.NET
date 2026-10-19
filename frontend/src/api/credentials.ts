import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type { LoginCredential } from "../utils/types";

export type LoginCredentialRequest = {
  name: string;
  category: string;
  username: string;
  password: string;
  notes: string | null;
};

export function getCredentials() {
  return apiGet<LoginCredential[]>("/credential");
}

export function createLoginCredential(request: LoginCredentialRequest) {
  return apiPost<LoginCredentialRequest, LoginCredential>(
    "/credential/login",
    request,
  );
}

export function updateLoginCredential(
  credentialId: number,
  request: LoginCredentialRequest,
) {
  return apiPut<LoginCredentialRequest, LoginCredential>(
    `/credential/${credentialId}/login`,
    request,
  );
}

export function deleteCredential(credentialId: number) {
  return apiDelete(`/credential/${credentialId}`);
}
