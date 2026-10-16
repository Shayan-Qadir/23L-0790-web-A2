import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  // Extract venue and city
  const venue = event._embedded?.venues?.[0]?.name || 'Venue TBA';
  const city = event._embedded?.venues?.[0]?.city?.name;
  const country = event._embedded?.venues?.[0]?.country?.name;
  const locationText = [city, country].filter(Boolean).join(', ') || 'Location TBA';

  // Format date and time
  const localDate = event.dates?.start?.localDate;
  const localTime = event.dates?.start?.localTime;
  let formattedDate = 'Date TBA';
  if (localDate) {
    try {
      const dateObj = new Date(localDate);
      formattedDate = dateObj.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      formattedDate = localDate;
    }
  }

  // Category segment
  const category =
    event.classifications?.[0]?.segment?.name ||
    event.classifications?.[0]?.genre?.name ||
    'General';

  // Best image (fallback placeholder if missing)
  const image =
    event.images?.find((img) => img.width >= 500)?.url ||
    event.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="event-card">
      <div className="event-card-image-wrap">
        <img
          src={image}
          alt={event.name}
          className="event-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="event-badge">{category}</span>
      </div>
      <div className="event-card-content">
        <div className="event-meta-date">
          <span>{formattedDate}</span>
          {localTime && <span> • {localTime.slice(0, 5)}</span>}
        </div>
        <h3 className="event-card-title">{event.name}</h3>
        <p className="event-card-venue">
          <strong>Venue:</strong> {venue}
        </p>
        <p className="event-card-location">
          <strong>Location:</strong> {locationText}
        </p>
        <div className="event-card-footer">
          <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
