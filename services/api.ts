/**
 * API service for backend communication
 */

// Get API URL - supports dynamic configuration for mobile devices
const getApiBaseUrl = (): string => {
  // Production URL - check for environment variable or GitHub Pages
  if (!__DEV__) {
    // Check if we're on GitHub Pages
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // GitHub Pages domain
      if (hostname.includes('github.io') || hostname.includes('github.com')) {
        // Use environment variable or default to a hosted backend
        // Users can configure this in settings
        const envApiUrl = process.env.REACT_APP_API_URL || process.env.EXPO_PUBLIC_API_URL;
        if (envApiUrl) {
          return envApiUrl;
        }
        // Default: users must configure backend URL in settings
        // For now, return empty string so users are prompted to configure
        return '';
      }
    }
    // Other production environments
    const envApiUrl = process.env.REACT_APP_API_URL || process.env.EXPO_PUBLIC_API_URL;
    return envApiUrl || 'https://your-production-api.com/api';
  }
  
  // Development - check for custom URL (for mobile devices)
  if (typeof localStorage !== 'undefined') {
    const customUrl = localStorage.getItem('api_base_url');
    if (customUrl) {
      return customUrl;
    }
  }
  
  // Try to detect if we're accessing from a remote device
  // If hostname is not localhost/127.0.0.1, use the host's IP
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing from another device (not localhost), use the host's IP
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname.includes('.')) {
      // Extract IP from current URL and use it for API
      return `http://${hostname}:3000/api`;
    }
  }
  
  // Default: localhost for web on same machine
  return 'http://localhost:3000/api';
};

// Allow updating API URL at runtime
export function setApiBaseUrl(url: string) {
  apiService.setApiUrl(url);
}

export function getApiBaseUrlValue(): string {
  return apiService.getApiUrl();
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;
  private apiBaseUrl: string = getApiBaseUrl();

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  getApiUrl(): string {
    // Check for updated URL in localStorage
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('api_base_url');
      if (stored) {
        this.apiBaseUrl = stored;
        return stored;
      }
    }
    return this.apiBaseUrl;
  }

  setApiUrl(url: string) {
    this.apiBaseUrl = url;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('api_base_url', url);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Get current API URL (may have been updated)
    const currentApiUrl = this.getApiUrl();

    try {
      const response = await fetch(`${currentApiUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Extract error message from HTML if present
        let errorMessage = text || 'Request failed';
        if (text && (text.includes('<title>') || text.includes('<h1>'))) {
          // Try to extract error from HTML with proper null checks
          const titleMatch = text.match(/<title>(.*?)<\/title>/i);
          const h1Match = text.match(/<h1>(.*?)<\/h1>/i);
          if (titleMatch && titleMatch[1]) {
            errorMessage = titleMatch[1].trim();
          } else if (h1Match && h1Match[1]) {
            errorMessage = h1Match[1].trim();
          } else {
            // Fallback: use status text if HTML parsing fails
            errorMessage = `${response.status} ${response.statusText || 'Error'}`;
          }
        }
        return { error: errorMessage };
      }

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 409) {
          return { error: data.error || 'An account with this email already exists. Please sign in instead.' };
        }
        if (response.status === 401) {
          return { error: data.error || 'Invalid email or password' };
        }
        if (response.status === 400) {
          return { error: data.error || 'Invalid input. Please check your information.' };
        }
        return { error: data.error || `Request failed (${response.status})` };
      }

      return { data };
    } catch (error: any) {
      console.error('API request error:', error);
      
      // More specific error messages
      if (error.message === 'Network request failed' || error.message === 'Failed to fetch') {
        return { 
          error: 'Cannot connect to server. Please make sure the backend is running on http://localhost:3000' 
        };
      }
      
      return { error: 'Network error. Please check your connection and ensure the backend server is running.' };
    }
  }

  // Auth endpoints
  async signup(email: string, password: string) {
    return this.request<{ token: string; user: { id: string; email: string } }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: { id: string; email: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: { id: string; email: string } }>(
      '/auth/verify'
    );
  }

  logout() {
    this.setToken(null);
  }

  // Wardrobe endpoints
  async getClothingItems() {
    return this.request('/wardrobe/items');
  }

  async createClothingItem(item: any) {
    return this.request('/wardrobe/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateClothingItem(id: string, updates: any) {
    return this.request(`/wardrobe/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteClothingItem(id: string) {
    return this.request(`/wardrobe/items/${id}`, {
      method: 'DELETE',
    });
  }

  async getSavedOutfits() {
    return this.request('/wardrobe/outfits');
  }

  async saveOutfit(outfit: any) {
    return this.request('/wardrobe/outfits', {
      method: 'POST',
      body: JSON.stringify(outfit),
    });
  }

  async getCalendarEntries(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return this.request(`/wardrobe/calendar${query ? `?${query}` : ''}`);
  }

  async saveCalendarEntry(entry: any) {
    return this.request('/wardrobe/calendar', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async getAppState() {
    return this.request<{ hasCompletedOnboarding: boolean; preferences: any }>(
      '/wardrobe/app-state'
    );
  }

  async updateAppState(state: { hasCompletedOnboarding?: boolean; preferences?: any }) {
    return this.request('/wardrobe/app-state', {
      method: 'PUT',
      body: JSON.stringify(state),
    });
  }
}

export const apiService = new ApiService();
