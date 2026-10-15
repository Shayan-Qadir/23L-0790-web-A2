import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-subtitle">Access your account and manage registrations.</p>
        <div className="placeholder-box">
          <p>Login form with email and password will be implemented here.</p>
        </div>
        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
