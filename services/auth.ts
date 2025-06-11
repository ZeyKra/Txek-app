import config from '@/config.json'; // Adjust the import path as necessary
const API_BASE_URL = config.API_URL; // Replace with your actual API endpoint

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserData {
    id: string;
    email: string;
    name: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log(API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },
  getData: async (token: string): Promise<UserData> => {
    console.log(token); // DEBUG: Log the token being used
    
    const response = await fetch(`${API_BASE_URL}/protected/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
        'authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'User data retrieval failed');
    }

    return data.user || data; // Adjust based on your API response structure
  },
};