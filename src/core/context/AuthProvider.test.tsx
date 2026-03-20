import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './AuthContext';

// Mock authService
vi.mock('../services/auth.service', () => ({
  authService: {
    logout: vi.fn().mockResolvedValue(undefined),
  },
}));

// Test component that exposes auth context
function TestConsumer() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'anonymous'}</p>
      <p data-testid="user-name">{user?.firstName ?? 'none'}</p>
      <button
        data-testid="login-btn"
        onClick={() =>
          login(
            { id: '1', firstName: 'Test', lastName: 'User', email: 'test@mail.com', role: 'Admin' },
            'token-abc',
            '2026-12-31'
          )
        }
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  it('should start as anonymous when sessionStorage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('anonymous');
    expect(screen.getByTestId('user-name').textContent).toBe('none');
  });

  it('should restore session from sessionStorage', () => {
    sessionStorage.setItem('user', JSON.stringify({
      id: '1', firstName: 'Restored', lastName: 'User', email: 'r@mail.com', role: 'User',
    }));
    sessionStorage.setItem('token', 'stored-token');
    sessionStorage.setItem('expiresAt', '2026-12-31');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');
    expect(screen.getByTestId('user-name').textContent).toBe('Restored');
  });

  it('should login and persist to sessionStorage', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'));
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');
    expect(screen.getByTestId('user-name').textContent).toBe('Test');
    expect(sessionStorage.getItem('token')).toBe('token-abc');
    expect(JSON.parse(sessionStorage.getItem('user')!).firstName).toBe('Test');
  });

  it('should logout, clear storage, and redirect', async () => {
    const user = userEvent.setup();

    sessionStorage.setItem('user', JSON.stringify({
      id: '1', firstName: 'Pre', lastName: 'Logout', email: 'pre@mail.com', role: 'User',
    }));
    sessionStorage.setItem('token', 'old-token');
    sessionStorage.setItem('expiresAt', '2026-12-31');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');

    await act(async () => {
      await user.click(screen.getByTestId('logout-btn'));
    });

    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(window.location.href).toBe('/login');
  });
});
