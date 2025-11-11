export enum UserRole {
  ADMIN = 'admin',
  EVALUATOR = 'evaluator',
  SUPERVISOR = 'supervisor',
  CANDIDATE = 'candidate',
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Candidate {
  id: string;
  userId: string;
  applicationNumber: string;
  personalInfo: {
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    nationality?: string;
  };
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
  };
  applicationStatus: 'pending' | 'under_review' | 'test_assigned' | 'tested' | 'selected' | 'rejected';
  assignedTests: string[];
  testResults: string[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  testType: 'concentration' | 'reaction' | 'visual' | 'memory' | 'field-independence';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  passingScore: number;
  totalMarks: number;
  questions: Question[];
  isActive: boolean;
  isPublished: boolean;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionType: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
  marks: number;
}

export interface TestSession {
  id: string;
  sessionCode: string;
  candidateId: string;
  testId: string;
  status: 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'abandoned';
  startedAt?: Date;
  completedAt?: Date;
  answers: Answer[];
  score?: Score;
}

export interface Answer {
  questionId: string;
  selectedAnswer: any;
  isCorrect: boolean;
  timeTaken: number;
  score: number;
}

export interface Score {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
}

export interface Result {
  id: string;
  sessionId: string;
  candidateId: string;
  testId: string;
  testType: string;
  score: {
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    passed: boolean;
  };
  isVerified: boolean;
  createdAt: Date;
}

export interface AnalyticsDashboard {
  totalCandidates: number;
  totalSessions: number;
  completedSessions: number;
  totalResults: number;
  passRate: number;
}
