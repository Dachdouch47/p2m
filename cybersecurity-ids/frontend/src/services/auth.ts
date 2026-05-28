import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const signup = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/signup`, { username, password });
  return response.data;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return axios.post(`${API_URL}/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then(res => res.data);
};

export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
