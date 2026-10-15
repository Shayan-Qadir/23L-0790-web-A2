import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Register to sign up for events and keep track of bookings.</p>
        <div className="placeholder-box">
          <p>Registration form with Name, Email, and Password will be implemented here.</p>
        </div>
        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
