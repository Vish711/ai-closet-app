/**
 * API service for backend communication
 */

// Get API URL - supports dynamic configuration for mobile devices
const getApiBaseUrl = (): string => {
  // First, check for custom URL in localStorage (user override)
  if (typeof localStorage !== 'undefined') {
    const customUrl = localStorage.getItem('api_base_url');
    if (customUrl && customUrl.trim() !== '') {
      return customUrl;
    }
  }

  // Check hostname first (most reliable for GitHub Pages)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // GitHub Pages domain - always use Render.com backend
    if (hostname.includes('github.io') || hostname.includes('github.com')) {
      const envApiUrl = process.env.REACT_APP_API_URL || process.env.EXPO_PUBLIC_API_URL;
      if (envApiUrl && envApiUrl.trim() !== '') {
        return envApiUrl;
      }
      // Default: use Render.com backend for GitHub Pages
      return 'https://ai-closet-backend.onrender.com/api';
    }
    
    // Localhost - use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    
    // Remote device (IP address) - try to use that IP for backend
    if (hostname.includes('.')) {
      // Could be accessing from another device on the network
      // Try using the same IP for backend
      return `http://${hostname}:3000/api`;
    }
  }

  // Production mode (not __DEV__) - use Render.com backend
  if (!__DEV__) {
    const envApiUrl = process.env.REACT_APP_API_URL || process.env.EXPO_PUBLIC_API_URL;
    return envApiUrl || 'https://ai-closet-backend.onrender.com/api';
  }
  
  // Development mode - default to localhost
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

  constructor() {
    // Log the initial API URL for debugging
    if (typeof window !== 'undefined') {
      console.log('🌐 API Service initialized');
      console.log('📍 Hostname:', window.location.hostname);
      console.log('🔗 API URL:', this.apiBaseUrl);
      console.log('🔧 __DEV__:', __DEV__);
    }
  }

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
    // Check for updated URL in localStorage first (user override)
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('api_base_url');
      if (stored && stored.trim() !== '') {
        this.apiBaseUrl = stored;
        return stored;
      }
    }
    // If no stored URL, re-evaluate the default (in case environment changed)
    const defaultUrl = getApiBaseUrl();
    if (defaultUrl && defaultUrl.trim() !== '') {
      // Only update if it's different (avoid unnecessary updates)
      if (this.apiBaseUrl !== defaultUrl) {
        this.apiBaseUrl = defaultUrl;
        if (typeof window !== 'undefined') {
          console.log('🔄 API URL updated to:', this.apiBaseUrl);
        }
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

    // Check if API URL is configured
    if (!currentApiUrl || currentApiUrl.trim() === '') {
      return { 
        error: 'Backend server URL not configured. Please set it in Profile → Settings → Backend Server URL' 
      };
    }

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
        return { error: text || 'Request failed' };
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
      console.error('API URL attempted:', currentApiUrl);
      
      // More specific error messages
      if (error.message === 'Network request failed' || error.message === 'Failed to fetch') {
        // Check if it's Render.com backend
        if (currentApiUrl.includes('onrender.com')) {
          return { 
            error: 'Cannot connect to Render.com backend. The service may be sleeping (free tier). Please wait 30-60 seconds and try again, or check your Render.com dashboard.' 
          };
        }
        // Check if it's localhost
        if (currentApiUrl.includes('localhost') || currentApiUrl.includes('127.0.0.1')) {
          return { 
            error: 'Cannot connect to local backend. Please make sure the backend is running: cd backend && npm run dev' 
          };
        }
        return { 
          error: `Cannot connect to backend at ${currentApiUrl}. Please check the URL in Profile → Settings.` 
        };
      }
      
      return { error: `Network error connecting to ${currentApiUrl}. Please check your connection and ensure the backend server is running.` };
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
