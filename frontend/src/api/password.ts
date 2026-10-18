import { apiPost } from "./api";
import type {
  GeneratePasswordRequest,
  GeneratePasswordResponse,
} from "../utils/types";

export async function generatePassword(profile?: string, length?: number) {
  const body: GeneratePasswordRequest = {
    length,
    profile,
  };

  return apiPost<GeneratePasswordRequest, GeneratePasswordResponse>(
    "/password/generate",
    body,
  );
}
