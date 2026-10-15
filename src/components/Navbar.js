import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          EventHub
        </Link>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Events
          </NavLink>
          <NavLink to="/my-events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            My Events
          </NavLink>
        </nav>
        <div className="navbar-auth">
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
