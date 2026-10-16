import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventsReducer from './eventsSlice';
import registrationReducer from './registrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registration: registrationReducer,
  },
});

export default store;
