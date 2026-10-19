import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  CreateLoginCredentialRequest,
  CreatePaymentCardCredentialRequest,
  CreateSshKeyCredentialRequest,
  CredentialResponse,
} from "../utils/types";

export const getCredentials = () => apiGet<CredentialResponse[]>("/credential");

export const getCredential = (credentialId: number) =>
  apiGet<CredentialResponse>(`/credential/${credentialId}`);

export const createLoginCredential = (request: CreateLoginCredentialRequest) =>
  apiPost<CreateLoginCredentialRequest, CredentialResponse>(
    "/credential/login",
    request,
  );

export const createSshKeyCredential = (
  request: CreateSshKeyCredentialRequest,
) =>
  apiPost<CreateSshKeyCredentialRequest, CredentialResponse>(
    "/credential/ssh-key",
    request,
  );

export const createPaymentCardCredential = (
  request: CreatePaymentCardCredentialRequest,
) =>
  apiPost<CreatePaymentCardCredentialRequest, CredentialResponse>(
    "/credential/payment-card",
    request,
  );

export const updateLoginCredential = (
  credentialId: number,
  request: CreateLoginCredentialRequest,
) =>
  apiPut<CreateLoginCredentialRequest, CredentialResponse>(
    `/credential/${credentialId}/login`,
    request,
  );

export const updateSshKeyCredential = (
  credentialId: number,
  request: CreateSshKeyCredentialRequest,
) =>
  apiPut<CreateSshKeyCredentialRequest, CredentialResponse>(
    `/credential/${credentialId}/ssh-key`,
    request,
  );

export const updatePaymentCardCredential = (
  credentialId: number,
  request: CreatePaymentCardCredentialRequest,
) =>
  apiPut<CreatePaymentCardCredentialRequest, CredentialResponse>(
    `/credential/${credentialId}/payment-card`,
    request,
  );

export const deleteCredential = (credentialId: number) =>
  apiDelete<void>(`/credential/${credentialId}`);
