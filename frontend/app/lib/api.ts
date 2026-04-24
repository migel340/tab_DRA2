const API_URL = "http://localhost:8080";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  surname: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  firstName: string;
  surname: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

async function request(url: string, options: RequestInit) {
  console.log(`→ ${options.method} ${url}`, options.body ?? "");

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));

  console.log(`← ${res.status} ${url}`, data);

  if (!res.ok) {
    throw new Error(data.error || `Błąd ${res.status}`);
  }

  return data;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return request(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return request(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
