import { College } from "./colleges-data";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://college-platform-cjpf.onrender.com/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isServer = typeof window === "undefined";
  const token = !isServer ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  } as HeadersInit;

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

export const collegesApi = {
  getAll: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
    return apiFetch<{ data: College[]; meta: any }>(`/colleges?${query.toString()}`);
  },
  getById: (id: string | number) => apiFetch<College>(`/colleges/${id}`),
  getStats: () => apiFetch<{ minFee: number; maxFee: number; states: string[]; totalColleges: number }>("/colleges/stats"),
  compare: (collegeIds: (string | number)[]) =>
    apiFetch<College[]>("/colleges/compare", {
      method: "POST",
      body: JSON.stringify({ collegeIds }),
    }),
};

export const authApi = {
  login: (credentials: any) => apiFetch<{ user: any; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  signup: (details: any) => apiFetch<{ user: any; token: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(details),
  }),
};
