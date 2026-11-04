import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [username, setUsername] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setUserDetails(null);

    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/login`, { username });
      if (response.data.success) {
        setUserDetails(response.data.user);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found. Try: alice, bob, or charlie');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUsername('');
    setUserDetails(null);
    setError('');
    setShowPassword(false);
  };

  return (
    <div className="app">
      <div className="card">
        <div className="card-header">
          <div className="logo">🔐</div>
          <h1>Login Portal</h1>
          <p>Enter your username to view account details</p>
        </div>

        {!userDetails ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="e.g. alice"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="alert alert-error">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="spinner">⏳ Searching...</span>
              ) : (
                'View Account Details'
              )}
            </button>

            <div className="hint">
              💡 Sample users: <strong>alice</strong>, <strong>bob</strong>, <strong>charlie</strong>
            </div>
          </form>
        ) : (
          <div className="user-details">
            <div className="success-banner">✅ User Found!</div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">🆔 ID</span>
                <span className="detail-value">{userDetails.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👤 Username</span>
                <span className="detail-value">{userDetails.username}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📧 Email</span>
                <span className="detail-value">{userDetails.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🔑 Password</span>
                <span className="detail-value password-field">
                  {showPassword ? userDetails.password : '••••••••'}
                  <button
                    className="btn-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📅 Created</span>
                <span className="detail-value">
                  {new Date(userDetails.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <button className="btn-secondary" onClick={handleReset}>
              ← Search Another User
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
