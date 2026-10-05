 import api from "./axios";

interface AuthResponse {
  token: string;
}

interface AuthData {
  email: string;
  password: string;
  name?: string; // optional for register
}

export const registerUser = async (data: AuthData): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
