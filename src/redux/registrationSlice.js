import { createSlice } from '@reduxjs/toolkit';

// Load stored registrations from localStorage
const storedRegistrations = JSON.parse(
  localStorage.getItem('eventRegistrations') || '[]'
);

const initialState = {
  registrations: storedRegistrations, // Array of { id, userId, userEmail, eventId, eventName, eventDate, eventImage, venue, city, registeredAt }
  error: null,
  successMessage: null,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    registerForEvent: (state, action) => {
      const { user, event } = action.payload;

      if (!user || !user.email) {
        state.error = 'You must be logged in to register for an event.';
        state.successMessage = null;
        return;
      }

      // Check for duplicate registration for the same user and event
      const alreadyRegistered = state.registrations.some(
        (reg) =>
          reg.userEmail.toLowerCase() === user.email.toLowerCase() &&
          reg.eventId === event.id
      );

      if (alreadyRegistered) {
        state.error = 'You are already registered for this event.';
        state.successMessage = null;
        return;
      }

      // Extract event summary details
      const venue = event._embedded?.venues?.[0]?.name || 'Venue TBA';
      const city = event._embedded?.venues?.[0]?.city?.name || 'City TBA';
      const eventDate = event.dates?.start?.localDate || 'Date TBA';
      const eventTime = event.dates?.start?.localTime || '';
      const eventImage =
        event.images?.find((img) => img.width >= 500)?.url ||
        event.images?.[0]?.url ||
        '';

      const newRegistration = {
        id: `${user.email}_${event.id}_${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        eventId: event.id,
        eventName: event.name,
        eventDate: eventDate,
        eventTime: eventTime,
        venue: venue,
        city: city,
        eventImage: eventImage,
        registeredAt: new Date().toISOString(),
      };

      state.registrations.push(newRegistration);
      state.error = null;
      state.successMessage = 'Successfully registered for this event!';

      // Sync with localStorage
      localStorage.setItem('eventRegistrations', JSON.stringify(state.registrations));
    },

    cancelRegistration: (state, action) => {
      const registrationId = action.payload;

      state.registrations = state.registrations.filter(
        (reg) => reg.id !== registrationId
      );
      state.successMessage = 'Registration cancelled successfully.';
      state.error = null;

      // Sync with localStorage
      localStorage.setItem('eventRegistrations', JSON.stringify(state.registrations));
    },

    clearRegistrationStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  registerForEvent,
  cancelRegistration,
  clearRegistrationStatus,
} = registrationSlice.actions;

export default registrationSlice.reducer;
