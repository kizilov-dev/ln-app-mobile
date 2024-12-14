import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://10.0.2.2:3000';

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  async register(email: string, password: string, username: string, targetLanguage: string) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        username,
        target_language: targetLanguage 
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },
}; 