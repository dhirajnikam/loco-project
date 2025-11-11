import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, AnalyticsDashboard } from '../types';
import apiService from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Only fetch analytics for authorized roles
        if (user?.role === UserRole.ADMIN || user?.role === UserRole.EVALUATOR || user?.role === UserRole.SUPERVISOR) {
          const data = await apiService.getDashboard();
          setAnalytics(data);
        }
      } catch (err: any) {
        setError('Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return '#e74c3c';
      case UserRole.EVALUATOR:
        return '#3498db';
      case UserRole.SUPERVISOR:
        return '#9b59b6';
      case UserRole.CANDIDATE:
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🚂 Loco Assessment System</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span
              className="user-role"
              style={{ backgroundColor: getRoleBadgeColor(user?.role || UserRole.CANDIDATE) }}
            >
              {user?.role.toUpperCase()}
            </span>
          </div>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user?.firstName}!</h2>
          <p>Your role: <strong>{user?.role}</strong></p>
        </div>

        {/* Analytics Dashboard - For Admin, Evaluator, Supervisor */}
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.EVALUATOR || user?.role === UserRole.SUPERVISOR) && (
          <div className="analytics-section">
            <h3>Dashboard Overview</h3>
            {loading ? (
              <p>Loading analytics...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : analytics ? (
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="card-icon">👥</div>
                  <div className="card-content">
                    <h4>Total Candidates</h4>
                    <p className="card-number">{analytics.totalCandidates}</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">📝</div>
                  <div className="card-content">
                    <h4>Total Sessions</h4>
                    <p className="card-number">{analytics.totalSessions}</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">✅</div>
                  <div className="card-content">
                    <h4>Completed Sessions</h4>
                    <p className="card-number">{analytics.completedSessions}</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">📊</div>
                  <div className="card-content">
                    <h4>Pass Rate</h4>
                    <p className="card-number">{analytics.passRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            {user?.role === UserRole.ADMIN && (
              <>
                <button className="action-card">
                  <span className="action-icon">👤</span>
                  <span className="action-text">Manage Users</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">👥</span>
                  <span className="action-text">View Candidates</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📝</span>
                  <span className="action-text">Manage Tests</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📊</span>
                  <span className="action-text">View Reports</span>
                </button>
              </>
            )}

            {user?.role === UserRole.EVALUATOR && (
              <>
                <button className="action-card">
                  <span className="action-icon">👥</span>
                  <span className="action-text">View Candidates</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">➕</span>
                  <span className="action-text">Create Test</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📋</span>
                  <span className="action-text">View Sessions</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📊</span>
                  <span className="action-text">View Results</span>
                </button>
              </>
            )}

            {user?.role === UserRole.SUPERVISOR && (
              <>
                <button className="action-card">
                  <span className="action-icon">📊</span>
                  <span className="action-text">View Analytics</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📈</span>
                  <span className="action-text">Performance Reports</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">👥</span>
                  <span className="action-text">Candidate Reports</span>
                </button>
              </>
            )}

            {user?.role === UserRole.CANDIDATE && (
              <>
                <button className="action-card">
                  <span className="action-icon">📝</span>
                  <span className="action-text">Take Test</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📊</span>
                  <span className="action-text">View My Results</span>
                </button>
                <button className="action-card">
                  <span className="action-icon">📄</span>
                  <span className="action-text">My Profile</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Test Types Information */}
        <div className="test-types-section">
          <h3>Available Test Types</h3>
          <div className="test-types-grid">
            <div className="test-type-card">
              <h4>🎯 Concentration Test</h4>
              <p>Measures attention and focus abilities</p>
            </div>
            <div className="test-type-card">
              <h4>⚡ Reaction Test</h4>
              <p>Evaluates response time and reflexes</p>
            </div>
            <div className="test-type-card">
              <h4>👁️ Visual Test</h4>
              <p>Assesses visual perception skills</p>
            </div>
            <div className="test-type-card">
              <h4>🧠 Memory Test</h4>
              <p>Tests memory capacity and recall</p>
            </div>
            <div className="test-type-card">
              <h4>🔍 Field Independence Test</h4>
              <p>Evaluates cognitive flexibility</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
