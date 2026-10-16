import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  setFilterKeyword,
  setFilterCategory,
  setFilterSort,
  resetFilters,
} from '../redux/eventsSlice';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Miscellaneous'];

function Events() {
  const dispatch = useDispatch();
  const { items, loading, error, filters } = useSelector((state) => state.events);

  // Local input state for smooth typing before search submit/debounce
  const [searchInput, setSearchInput] = useState(filters.keyword);

  const loadEvents = useCallback(() => {
    dispatch(
      fetchEvents({
        keyword: filters.keyword,
        classificationName: filters.classificationName,
        sort: filters.sort,
      })
    );
  }, [dispatch, filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilterKeyword(searchInput));
  };

  const handleCategoryChange = (cat) => {
    dispatch(setFilterCategory(cat));
  };

  const handleSortChange = (e) => {
    dispatch(setFilterSort(e.target.value));
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Explore Events</h1>
        <p>Discover live music, sporting matches, theatre performances, and local shows.</p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="events-toolbar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by artist, event name, or city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="toolbar-controls">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="form-select"
              value={filters.sort}
              onChange={handleSortChange}
            >
              <option value="date,asc">Date (Earliest First)</option>
              <option value="date,desc">Date (Latest First)</option>
              <option value="name,asc">Event Name (A-Z)</option>
              <option value="relevance,desc">Relevance</option>
            </select>
          </div>

          {(filters.keyword || filters.classificationName !== 'All') && (
            <button onClick={handleReset} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`pill-btn ${filters.classificationName === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-danger">
          <p style={{ margin: 0 }}>
            <strong>Error loading events:</strong> {error}
          </p>
          <button onClick={loadEvents} className="btn btn-sm btn-outline" style={{ marginTop: '0.5rem' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="events-grid">
          {items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="placeholder-box empty-state">
          <h3>No events found</h3>
          <p>Try searching for a different keyword or selecting another category.</p>
          <button onClick={handleReset} className="btn btn-outline btn-sm">
            Show All Events
          </button>
        </div>
      )}
    </div>
  );
}

export default Events;
