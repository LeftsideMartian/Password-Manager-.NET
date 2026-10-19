import { apiDelete, apiGet, apiPost } from "./api";
import type {
  ChangePasswordRequest,
  UpdateUserRequest,
  User,
} from "../utils/types";

export const getUser = (userId: number) => apiGet<User>(`/user/${userId}`);

export const changePassword = (
  userId: number,
  request: ChangePasswordRequest,
) => apiPost<ChangePasswordRequest, void>(`/user/${userId}/password`, request);

export const updateUser = (userId: number, request: UpdateUserRequest) =>
  apiPost<UpdateUserRequest, void>(`/user/${userId}`, request);

export const deleteUser = (userId: number) =>
  apiDelete<void>(`/user/${userId}`);
