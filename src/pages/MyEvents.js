import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cancelRegistration } from '../redux/registrationSlice';

function MyEvents() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { registrations, successMessage } = useSelector((state) => state.registration);

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed'
  const [cancelModalId, setCancelModalId] = useState(null);

  // Filter registrations specifically for the logged-in user
  const userRegistrations = registrations.filter(
    (reg) => reg.userEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  // Current timestamp for dividing upcoming vs completed
  const now = new Date();

  // Distinguish between upcoming and completed/past events
  const upcomingEvents = userRegistrations.filter((reg) => {
    if (!reg.eventDate || reg.eventDate === 'Date TBA') return true;
    const eventDateTime = new Date(`${reg.eventDate}T${reg.eventTime || '23:59:59'}`);
    return isNaN(eventDateTime.getTime()) ? true : eventDateTime >= now;
  });

  const completedEvents = userRegistrations.filter((reg) => {
    if (!reg.eventDate || reg.eventDate === 'Date TBA') return false;
    const eventDateTime = new Date(`${reg.eventDate}T${reg.eventTime || '23:59:59'}`);
    return !isNaN(eventDateTime.getTime()) && eventDateTime < now;
  });

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : completedEvents;

  const handleConfirmCancel = (id) => {
    dispatch(cancelRegistration(id));
    setCancelModalId(null);
  };

  return (
    <div className="page-container my-events-page">
      <div className="page-header">
        <h1>My Registered Events</h1>
        <p>Manage your booked events, check dates, and track your schedule.</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Navigation Tabs */}
      <div className="my-events-tabs">
        <button
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Events ({completedEvents.length})
        </button>
      </div>

      {/* Event List or Empty State */}
      {displayedEvents.length === 0 ? (
        <div className="placeholder-box empty-state">
          <h3>No {activeTab} events</h3>
          <p>
            {activeTab === 'upcoming'
              ? "You haven't registered for any upcoming events yet."
              : 'You have no past or completed events.'}
          </p>
          <Link to="/events" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
            Explore Available Events
          </Link>
        </div>
      ) : (
        <div className="registered-events-list">
          {displayedEvents.map((reg) => (
            <div key={reg.id} className="registered-event-card">
              <div className="registered-event-image-wrap">
                <img
                  src={
                    reg.eventImage ||
                    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={reg.eventName}
                  className="registered-event-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>

              <div className="registered-event-info">
                <div className="registered-event-date">
                  <span>{reg.eventDate}</span>
                  {reg.eventTime && <span> • {reg.eventTime.slice(0, 5)}</span>}
                </div>
                <h3 className="registered-event-title">{reg.eventName}</h3>
                <p className="registered-event-meta">
                  <strong>Venue:</strong> {reg.venue} &bull; {reg.city}
                </p>
                <p className="registered-date-text">
                  Registered on: {new Date(reg.registeredAt).toLocaleDateString()}
                </p>
              </div>

              <div className="registered-event-actions">
                <Link to={`/events/${reg.eventId}`} className="btn btn-outline btn-sm">
                  View Details
                </Link>

                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => setCancelModalId(reg.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Cancel Registration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {cancelModalId && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Cancel Registration</h3>
            <p>
              Are you sure you want to cancel your registration for this event? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setCancelModalId(null)}
                className="btn btn-secondary btn-sm"
              >
                Keep Registration
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelModalId)}
                className="btn btn-danger btn-sm"
              >
                Yes, Cancel Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEvents;
