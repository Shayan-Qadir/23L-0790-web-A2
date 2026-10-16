// Ticketmaster Discovery API Base Configuration
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY;

/**
 * Fetch events from Ticketmaster Discovery API
 * Supports keyword search, classification/category, size, and sort parameters
 */
export async function getEvents({
  keyword = '',
  classificationName = '',
  sort = 'date,asc',
  size = 20,
} = {}) {
  if (!API_KEY) {
    throw new Error('Ticketmaster API key is missing. Please set REACT_APP_TICKETMASTER_API_KEY in your .env file.');
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    size: size.toString(),
    sort: sort,
  });

  if (keyword.trim()) {
    params.append('keyword', keyword.trim());
  }

  if (classificationName && classificationName !== 'All') {
    params.append('classificationName', classificationName);
  }

  const response = await fetch(`${BASE_URL}/events.json?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Ticketmaster API rate limit exceeded. Please wait a moment and try again.');
    }
    throw new Error(`Ticketmaster API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  const events = data._embedded?.events || [];
  return events;
}

/**
 * Fetch individual event details by Ticketmaster Event ID
 */
export async function getEventById(id) {
  if (!API_KEY) {
    throw new Error('Ticketmaster API key is missing. Please set REACT_APP_TICKETMASTER_API_KEY in your .env file.');
  }

  const response = await fetch(`${BASE_URL}/events/${id}.json?apikey=${API_KEY}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Event not found.');
    }
    throw new Error(`Failed to load event details: ${response.statusText}`);
  }

  return await response.json();
}
