import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import apiService from './services/api';

// Mock the API service
jest.mock('./services/api');
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock the getProfile method
    mockedApiService.getProfile = jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'candidate',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  it('renders without crashing', () => {
    render(<App />);
    // App should render either login page or redirect to dashboard
    expect(document.body).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    render(<App />);
    // When not authenticated, should show login page
    expect(await screen.findByText(/login to your account/i)).toBeInTheDocument();
  });
});
