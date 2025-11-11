import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Candidate,
  Test,
  TestSession,
  Result,
  AnalyticsDashboard,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/auth/profile');
    return response.data;
  }

  // Users
  async getUsers(page: number = 1, limit: number = 10) {
    const response = await this.api.get('/users', {
      params: { page, limit },
    });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.api.patch<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Candidates
  async getCandidates(page: number = 1, limit: number = 10) {
    const response = await this.api.get('/candidates', {
      params: { page, limit },
    });
    return response.data;
  }

  async getCandidateById(id: string): Promise<Candidate> {
    const response = await this.api.get<Candidate>(`/candidates/${id}`);
    return response.data;
  }

  async createCandidate(data: any): Promise<Candidate> {
    const response = await this.api.post<Candidate>('/candidates', data);
    return response.data;
  }

  async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
    const response = await this.api.patch<Candidate>(`/candidates/${id}`, data);
    return response.data;
  }

  // Tests
  async getTests(page: number = 1, limit: number = 10) {
    const response = await this.api.get('/tests', {
      params: { page, limit },
    });
    return response.data;
  }

  async getTestById(id: string): Promise<Test> {
    const response = await this.api.get<Test>(`/tests/${id}`);
    return response.data;
  }

  async createTest(data: any): Promise<Test> {
    const response = await this.api.post<Test>('/tests', data);
    return response.data;
  }

  async updateTest(id: string, data: Partial<Test>): Promise<Test> {
    const response = await this.api.patch<Test>(`/tests/${id}`, data);
    return response.data;
  }

  // Test Sessions
  async getSessions(page: number = 1, limit: number = 10) {
    const response = await this.api.get('/sessions', {
      params: { page, limit },
    });
    return response.data;
  }

  async getSessionById(id: string): Promise<TestSession> {
    const response = await this.api.get<TestSession>(`/sessions/${id}`);
    return response.data;
  }

  async createSession(candidateId: string, testId: string): Promise<TestSession> {
    const response = await this.api.post<TestSession>('/sessions', {
      candidateId,
      testId,
    });
    return response.data;
  }

  async startSession(id: string): Promise<TestSession> {
    const response = await this.api.patch<TestSession>(`/sessions/${id}/start`);
    return response.data;
  }

  async submitAnswer(id: string, questionId: string, answer: any): Promise<TestSession> {
    const response = await this.api.post<TestSession>(`/sessions/${id}/answer`, {
      questionId,
      answer,
    });
    return response.data;
  }

  async submitSession(id: string): Promise<TestSession> {
    const response = await this.api.post<TestSession>(`/sessions/${id}/submit`);
    return response.data;
  }

  // Results
  async getResults(page: number = 1, limit: number = 10) {
    const response = await this.api.get('/results', {
      params: { page, limit },
    });
    return response.data;
  }

  async getResultById(id: string): Promise<Result> {
    const response = await this.api.get<Result>(`/results/${id}`);
    return response.data;
  }

  async getCandidateResults(candidateId: string): Promise<Result[]> {
    const response = await this.api.get<Result[]>(`/results/candidate/${candidateId}`);
    return response.data;
  }

  async generateResult(sessionId: string): Promise<Result> {
    const response = await this.api.post<Result>(`/results/generate/${sessionId}`);
    return response.data;
  }

  // Analytics
  async getDashboard(): Promise<AnalyticsDashboard> {
    const response = await this.api.get<AnalyticsDashboard>('/analytics/dashboard');
    return response.data;
  }

  async getTestPerformance(testType?: string) {
    const response = await this.api.get('/analytics/test-performance', {
      params: testType ? { testType } : {},
    });
    return response.data;
  }

  // Reports
  async getCandidateReport(candidateId: string) {
    const response = await this.api.get(`/reports/candidate/${candidateId}`);
    return response.data;
  }
}

export default new ApiService();
