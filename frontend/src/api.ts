const API_URL = "http://localhost:5126";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json() as Promise<{
    email: string;
    token: string;
    expiresIn: number;
  }>;
}

export async function generatePassword(
  token: string,
  profile?: string,
  length?: number,
) {
  const response = await fetch(`${API_URL}/password/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profile, length }),
  });

  if (!response.ok) {
    throw new Error(`Password generation failed (${response.status}).`);
  }

  return response.json() as Promise<{
    password: string;
    profile: string;
    length: number;
  }>;
}