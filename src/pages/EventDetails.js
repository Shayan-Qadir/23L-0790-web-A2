import React from 'react';
import { useParams, Link } from 'react-router-dom';

function EventDetails() {
  const { id } = useParams();

  return (
    <div className="page-container">
      <Link to="/events" className="back-link">
        ← Back to Events
      </Link>
      <div className="page-header">
        <h1>Event Details</h1>
        <p>Viewing details for Event ID: {id}</p>
      </div>
      <div className="placeholder-box">
        <p>Full event details, date/time, venue information, and registration button will appear here.</p>
      </div>
    </div>
  );
}

export default EventDetails;
