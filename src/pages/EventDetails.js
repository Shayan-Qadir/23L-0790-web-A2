import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventDetails, clearSelectedEvent } from '../redux/eventsSlice';
import { registerForEvent, clearRegistrationStatus } from '../redux/registrationSlice';

function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent: event, detailsLoading: loading, detailsError: error } = useSelector(
    (state) => state.events
  );
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const { registrations, error: regError, successMessage } = useSelector(
    (state) => state.registration
  );

  // Check if current user is already registered for this event
  const isAlreadyRegistered = Boolean(
    currentUser &&
      registrations.some(
        (reg) =>
          reg.userEmail.toLowerCase() === currentUser.email.toLowerCase() &&
          reg.eventId === id
      )
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchEventDetails(id));
    }

    return () => {
      dispatch(clearSelectedEvent());
      dispatch(clearRegistrationStatus());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container">
        <Link to="/events" className="back-link">
          &larr; Back to Events
        </Link>
        <div className="alert alert-danger">
          <p style={{ margin: 0 }}>
            <strong>Error:</strong> {error || 'Event could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  // Extract event data cleanly
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name || 'Venue TBA';
  const venueAddress = venue?.address?.line1;
  const city = venue?.city?.name;
  const country = venue?.country?.name;
  const fullLocation = [venueAddress, city, country].filter(Boolean).join(', ') || 'Location details unavailable';

  // Date formatting
  const localDate = event.dates?.start?.localDate;
  const localTime = event.dates?.start?.localTime;
  let formattedDate = 'Date TBA';
  if (localDate) {
    try {
      const dateObj = new Date(localDate);
      formattedDate = dateObj.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      formattedDate = localDate;
    }
  }

  // Classifications
  const segment = event.classifications?.[0]?.segment?.name || 'General';
  const genre = event.classifications?.[0]?.genre?.name;

  // Best high-res image
  const image =
    event.images?.find((img) => img.width >= 1000)?.url ||
    event.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80';

  // Ticket status & prices
  const status = event.dates?.status?.code || 'unknown';
  const priceRange = event.priceRanges?.[0];
  const priceDisplay = priceRange
    ? `${priceRange.currency || '$'} ${priceRange.min} - ${priceRange.max}`
    : 'Standard Admission';

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    dispatch(
      registerForEvent({
        user: currentUser,
        event: event,
      })
    );
  };

  return (
    <div className="page-container event-details-page">
      <Link to="/events" className="back-link">
        &larr; Back to Events
      </Link>

      <div className="event-details-card">
        <div className="event-details-hero">
          <img
            src={image}
            alt={event.name}
            className="event-details-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="event-details-badge-group">
            <span className="badge badge-primary">{segment}</span>
            {genre && <span className="badge badge-secondary">{genre}</span>}
          </div>
        </div>

        <div className="event-details-body">
          <div className="event-details-main">
            <h1 className="event-details-title">{event.name}</h1>

            <div className="info-block">
              <h3>Date and Time</h3>
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>
              {localTime && (
                <p>
                  <strong>Time:</strong> {localTime.slice(0, 5)}
                </p>
              )}
            </div>

            <div className="info-block">
              <h3>Venue & Location</h3>
              <p>
                <strong>Venue:</strong> {venueName}
              </p>
              <p>
                <strong>Address:</strong> {fullLocation}
              </p>
              {venue?.url && (
                <p>
                  <a href={venue.url} target="_blank" rel="noopener noreferrer">
                    Official Venue Page &rarr;
                  </a>
                </p>
              )}
            </div>

            {event.info && (
              <div className="info-block">
                <h3>About This Event</h3>
                <p>{event.info}</p>
              </div>
            )}

            {event.pleaseNote && (
              <div className="info-block note-box">
                <h4>Please Note</h4>
                <p>{event.pleaseNote}</p>
              </div>
            )}
          </div>

          <aside className="event-details-sidebar">
            <div className="sidebar-box">
              <h3>Event Registration</h3>

              {regError && <div className="alert alert-danger">{regError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <div className="sidebar-stat">
                <span>Status</span>
                <span className={`status-pill status-${status}`}>
                  {status.toUpperCase()}
                </span>
              </div>
              <div className="sidebar-stat">
                <span>Price</span>
                <strong>{priceDisplay}</strong>
              </div>

              {isAlreadyRegistered ? (
                <div style={{ marginTop: '1.25rem' }}>
                  <button className="btn btn-secondary btn-block" disabled>
                    Registered
                  </button>
                  <p className="sidebar-hint" style={{ marginTop: '0.5rem' }}>
                    View in <Link to="/my-events">My Events</Link>
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '1.25rem' }}
                >
                  Register for Event
                </button>
              )}

              {!isAuthenticated && (
                <p className="sidebar-hint">
                  You need to be logged in to register.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
