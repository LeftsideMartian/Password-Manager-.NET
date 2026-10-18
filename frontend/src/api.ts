const API_URL = "http://localhost:5126";

export type Credential = {
  credentialId: number;
  name: string;
  username: string;
  password: string;
  category: string;
  note: string;
  userId: number;
};

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
    firstName: string;
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

async function authenticatedRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Your session has expired.");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    throw new Error("Your session has expired.");
  }
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response;
}

export async function getCredentials() {
  const response = await authenticatedRequest("/credential");
  return response.json() as Promise<Credential[]>;
}

export async function createCredential(
  credential: Omit<Credential, "credentialId" | "userId">,
) {
  const response = await authenticatedRequest("/credential", {
    method: "POST",
    body: JSON.stringify(credential),
  });
  return response.json() as Promise<Credential>;
}