/**
 * Authentication Context
 * ======================
 * Manages JWT auth state, login/logout, and protected route access.
 * Uses mock data when VITE_USE_MOCK=true.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthResponse, AuthState, LoginRequest, RegisterRequest, User } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'wfi-auth';

// Mock users for standalone mode
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'admin@workforce.ai': {
    password: 'Admin@123',
    user: {
      id: 'mock-admin-001',
      email: 'admin@workforce.ai',
      first_name: 'System',
      last_name: 'Administrator',
      role: 'admin',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  },
  'hr@workforce.ai': {
    password: 'HRManager@123',
    user: {
      id: 'mock-hr-001',
      email: 'hr@workforce.ai',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'hr_manager',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  },
  'demo@workforce.ai': {
    password: 'Demo@123',
    user: {
      id: 'mock-emp-001',
      email: 'demo@workforce.ai',
      first_name: 'Alex',
      last_name: 'Demo',
      role: 'employee',
      is_active: true,
      created_at: '2024-06-15T00:00:00Z',
    },
  },
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function loadStoredAuth(): AuthState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user,
        tokens: parsed.tokens,
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { user: null, tokens: null, isAuthenticated: false, isLoading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    ...loadStoredAuth(),
    isLoading: true,
  }));

  // Initialize — check stored auth on mount
  useEffect(() => {
    const stored = loadStoredAuth();
    setState({ ...stored, isLoading: false });
  }, []);

  const persistAuth = useCallback((user: User, tokens: AuthResponse['tokens']) => {
    const data = { user, tokens };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setState({
      user,
      tokens,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      if (USE_MOCK) {
        // Mock authentication
        const mockEntry = MOCK_USERS[data.email];
        if (!mockEntry || mockEntry.password !== data.password) {
          throw new Error('Invalid email or password');
        }
        const tokens = {
          access_token: `mock-access-${Date.now()}`,
          refresh_token: `mock-refresh-${Date.now()}`,
          token_type: 'bearer',
          expires_in: 1800,
        };
        persistAuth(mockEntry.user, tokens);
        return;
      }

      // Real API call
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMsg = 'Login failed';
        try {
          const error = await response.json();
          errorMsg = error.detail || error.message || errorMsg;
        } catch {
          errorMsg = `Server error: The backend may be offline (${response.status})`;
        }
        throw new Error(errorMsg);
      }
      const result = await response.json();
      persistAuth(result.data.user, result.data.tokens);
    },
    [persistAuth]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      if (USE_MOCK) {
        // Mock registration — create user and login
        const user: User = {
          id: `mock-${Date.now()}`,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role as User['role'],
          is_active: true,
          created_at: new Date().toISOString(),
        };
        const tokens = {
          access_token: `mock-access-${Date.now()}`,
          refresh_token: `mock-refresh-${Date.now()}`,
          token_type: 'bearer',
          expires_in: 1800,
        };
        persistAuth(user, tokens);
        return;
      }

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMsg = 'Registration failed';
        try {
          const error = await response.json();
          errorMsg = error.detail || error.message || errorMsg;
        } catch {
          errorMsg = `Server error: The backend may be offline (${response.status})`;
        }
        throw new Error(errorMsg);
      }
      const result = await response.json();
      persistAuth(result.data.user, result.data.tokens);
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((user: User) => {
    setState((prev) => {
      if (prev.tokens) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, tokens: prev.tokens }));
      }
      return { ...prev, user };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
