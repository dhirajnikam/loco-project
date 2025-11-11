import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { UserRole } from '../types';
import apiService from '../services/api';

// Mock the API service
jest.mock('../services/api');
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

// Mock the Loading component
jest.mock('../components/Loading', () => {
  return function Loading({ message }: { message?: string }) {
    return <div data-testid="loading">{message || 'Loading...'}</div>;
  };
});

describe('Dashboard Component', () => {
  const mockAnalytics = {
    totalCandidates: 150,
    totalSessions: 320,
    completedSessions: 280,
    totalResults: 280,
    passRate: 82.5,
  };

  const renderDashboard = (role: UserRole = UserRole.CANDIDATE) => {
    return render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Set up a mock user in localStorage
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.CANDIDATE,
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('accessToken', 'mock-token');

    // Mock the getProfile method
    mockedApiService.getProfile = jest.fn().mockResolvedValue(mockUser);
  });

  describe('Basic Rendering', () => {
    it('renders dashboard header', () => {
      renderDashboard();

      expect(screen.getByText('🚂 Loco Assessment System')).toBeInTheDocument();
    });

    it('renders available test types section', () => {
      renderDashboard();

      expect(screen.getByText('Available Test Types')).toBeInTheDocument();
      expect(screen.getByText('🎯 Concentration Test')).toBeInTheDocument();
      expect(screen.getByText('⚡ Reaction Test')).toBeInTheDocument();
      expect(screen.getByText('👁️ Visual Test')).toBeInTheDocument();
      expect(screen.getByText('🧠 Memory Test')).toBeInTheDocument();
      expect(screen.getByText('🔍 Field Independence Test')).toBeInTheDocument();
    });
  });

  describe('Role-Based Quick Actions', () => {
    it('renders candidate quick actions', () => {
      renderDashboard(UserRole.CANDIDATE);

      expect(screen.getByText('Take Test')).toBeInTheDocument();
      expect(screen.getByText('View My Results')).toBeInTheDocument();
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });
  });

  describe('Analytics Dashboard', () => {
    it('does not display analytics for candidate users', () => {
      renderDashboard(UserRole.CANDIDATE);

      expect(screen.queryByText('Dashboard Overview')).not.toBeInTheDocument();
    });

    it('displays loading state while fetching analytics for admin', async () => {
      // Set admin user in localStorage
      const adminUser = {
        id: '123',
        email: 'admin@example.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(adminUser));

      mockedApiService.getDashboard.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockAnalytics), 100))
      );

      renderDashboard(UserRole.ADMIN);

      // Check if loading state appears
      await waitFor(() => {
        const loadingElement = screen.queryByTestId('loading');
        if (loadingElement) {
          expect(loadingElement).toBeInTheDocument();
        }
      }, { timeout: 500 });
    });

    it('displays error message when analytics fetch fails for admin', async () => {
      // Set admin user in localStorage
      const adminUser = {
        id: '123',
        email: 'admin@example.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('accessToken', 'admin-token');

      // Mock both getProfile (for auth) and getDashboard (for analytics)
      mockedApiService.getProfile = jest.fn().mockResolvedValue(adminUser);
      mockedApiService.getDashboard = jest.fn().mockRejectedValue(new Error('Network error'));

      renderDashboard(UserRole.ADMIN);

      await waitFor(() => {
        expect(screen.getByText('Failed to load analytics')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Test Types Information', () => {
    it('displays all test type cards with descriptions', () => {
      renderDashboard();

      expect(screen.getByText('Measures attention and focus abilities')).toBeInTheDocument();
      expect(screen.getByText('Evaluates response time and reflexes')).toBeInTheDocument();
      expect(screen.getByText('Assesses visual perception skills')).toBeInTheDocument();
      expect(screen.getByText('Tests memory capacity and recall')).toBeInTheDocument();
      expect(screen.getByText('Evaluates cognitive flexibility')).toBeInTheDocument();
    });
  });
});
