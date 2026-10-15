import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <h1>Discover & Manage Amazing Events</h1>
        <p>Explore upcoming concerts, sports games, theatre shows, and arts events powered by Ticketmaster.</p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary">
            Explore Events
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>What You Can Do</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🔍 Explore</h3>
            <p>Browse thousands of live events in real-time with search and category filters.</p>
          </div>
          <div className="feature-card">
            <h3>🎟️ Register</h3>
            <p>Quickly register for events you want to attend and manage your bookings.</p>
          </div>
          <div className="feature-card">
            <h3>📅 Track</h3>
            <p>View your upcoming and completed events in your personal dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
