// Ticketmaster Discovery API Base Configuration
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY;

// Realistic fallback events for testing when API key is unconfigured or rate limited
const FALLBACK_EVENTS = [
  {
    id: 'sample-event-1',
    name: 'Coldplay - Music of the Spheres World Tour',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        width: 800,
        height: 500,
      },
    ],
    dates: {
      start: {
        localDate: '2026-11-20',
        localTime: '19:30:00',
      },
      status: {
        code: 'onsale',
      },
    },
    classifications: [
      {
        segment: { name: 'Music' },
        genre: { name: 'Rock / Pop' },
      },
    ],
    _embedded: {
      venues: [
        {
          name: 'Wembley Stadium',
          city: { name: 'London' },
          country: { name: 'United Kingdom' },
          address: { line1: 'Wembley Park' },
        },
      ],
    },
    priceRanges: [
      {
        min: 65,
        max: 180,
        currency: 'GBP',
      },
    ],
    info: 'Experience Coldplay live with full immersive light shows, stadium anthems, and sustainable stage production.',
  },
  {
    id: 'sample-event-2',
    name: 'UEFA Champions League - Quarter Final',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        width: 800,
        height: 500,
      },
    ],
    dates: {
      start: {
        localDate: '2026-12-05',
        localTime: '20:00:00',
      },
      status: {
        code: 'onsale',
      },
    },
    classifications: [
      {
        segment: { name: 'Sports' },
        genre: { name: 'Football' },
      },
    ],
    _embedded: {
      venues: [
        {
          name: 'Camp Nou',
          city: { name: 'Barcelona' },
          country: { name: 'Spain' },
          address: { line1: 'C. d\'Arístides Maillol, 12' },
        },
      ],
    },
    priceRanges: [
      {
        min: 90,
        max: 350,
        currency: 'EUR',
      },
    ],
    info: 'Top European clubs clash in the UEFA Champions League knockout stages.',
  },
  {
    id: 'sample-event-3',
    name: 'Hamilton - Broadway Musical',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
        width: 800,
        height: 500,
      },
    ],
    dates: {
      start: {
        localDate: '2026-11-28',
        localTime: '18:00:00',
      },
      status: {
        code: 'onsale',
      },
    },
    classifications: [
      {
        segment: { name: 'Arts & Theatre' },
        genre: { name: 'Musical' },
      },
    ],
    _embedded: {
      venues: [
        {
          name: 'Richard Rodgers Theatre',
          city: { name: 'New York' },
          country: { name: 'United States' },
          address: { line1: '226 W 46th St' },
        },
      ],
    },
    priceRanges: [
      {
        min: 120,
        max: 450,
        currency: 'USD',
      },
    ],
    info: 'The award-winning musical telling the story of American Founding Father Alexander Hamilton.',
  },
  {
    id: 'sample-event-4',
    name: 'Hans Zimmer Live in Concert',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
        width: 800,
        height: 500,
      },
    ],
    dates: {
      start: {
        localDate: '2026-12-18',
        localTime: '19:00:00',
      },
      status: {
        code: 'onsale',
      },
    },
    classifications: [
      {
        segment: { name: 'Music' },
        genre: { name: 'Classical / Soundtrack' },
      },
    ],
    _embedded: {
      venues: [
        {
          name: 'Madison Square Garden',
          city: { name: 'New York' },
          country: { name: 'United States' },
          address: { line1: '4 Pennsylvania Plaza' },
        },
      ],
    },
    priceRanges: [
      {
        min: 75,
        max: 220,
        currency: 'USD',
      },
    ],
    info: 'Hollywood film score composer Hans Zimmer performs his greatest soundtracks including Inception, Interstellar, and Gladiator.',
  },
  {
    id: 'sample-event-5',
    name: 'International Modern Art Exhibition',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80',
        width: 800,
        height: 500,
      },
    ],
    dates: {
      start: {
        localDate: '2026-10-10', // completed/past event for testing
        localTime: '10:00:00',
      },
      status: {
        code: 'completed',
      },
    },
    classifications: [
      {
        segment: { name: 'Arts & Theatre' },
        genre: { name: 'Exhibition' },
      },
    ],
    _embedded: {
      venues: [
        {
          name: 'Tate Modern Gallery',
          city: { name: 'London' },
          country: { name: 'United Kingdom' },
          address: { line1: 'Bankside' },
        },
      ],
    },
    priceRanges: [
      {
        min: 25,
        max: 40,
        currency: 'GBP',
      },
    ],
    info: 'A curated showcase of contemporary sculpture, paintings, and media installations from global artists.',
  },
];

/**
 * Fetch events from Ticketmaster Discovery API
 * Supports keyword search, classification/category, size, and sort parameters
 */
export async function getEvents({ keyword = '', classificationName = '', sort = 'date,asc', size = 20 } = {}) {
  // If no API key is provided, use structured fallback data
  if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'your_ticketmaster_api_key_here') {
    return filterFallbackEvents({ keyword, classificationName });
  }

  try {
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
        throw new Error('Ticketmaster API rate limit reached. Please try again in a few moments.');
      }
      throw new Error(`Ticketmaster API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const events = data._embedded?.events || [];
    return events;
  } catch (error) {
    console.warn('API fetch failed, falling back to local dataset:', error.message);
    // If network fails or quota exceeded, seamlessly return filtered fallback events
    return filterFallbackEvents({ keyword, classificationName });
  }
}

/**
 * Fetch individual event details by Ticketmaster Event ID
 */
export async function getEventById(id) {
  if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'your_ticketmaster_api_key_here') {
    const found = FALLBACK_EVENTS.find((e) => e.id === id);
    if (!found) {
      throw new Error('Event not found.');
    }
    return found;
  }

  try {
    const response = await fetch(`${BASE_URL}/events/${id}.json?apikey=${API_KEY}`);

    if (!response.ok) {
      // Fallback search in case it was a sample event ID
      const foundInFallback = FALLBACK_EVENTS.find((e) => e.id === id);
      if (foundInFallback) return foundInFallback;

      throw new Error(`Failed to load event details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const foundInFallback = FALLBACK_EVENTS.find((e) => e.id === id);
    if (foundInFallback) return foundInFallback;
    throw error;
  }
}

function filterFallbackEvents({ keyword = '', classificationName = '' }) {
  let filtered = [...FALLBACK_EVENTS];

  if (keyword.trim()) {
    const term = keyword.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e._embedded?.venues?.[0]?.city?.name?.toLowerCase().includes(term) ||
        e._embedded?.venues?.[0]?.name?.toLowerCase().includes(term)
    );
  }

  if (classificationName && classificationName !== 'All') {
    filtered = filtered.filter((e) =>
      e.classifications?.some(
        (c) => c.segment?.name?.toLowerCase() === classificationName.toLowerCase()
      )
    );
  }

  return filtered;
}
