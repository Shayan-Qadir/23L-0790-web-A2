import { createSlice } from '@reduxjs/toolkit';

// Retrieve stored session and registered users from localStorage
const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const storedUsersList = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

const initialState = {
  users: storedUsersList, // list of registered accounts
  currentUser: storedUser, // currently authenticated user
  isAuthenticated: !!storedUser,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { name, email, password } = action.payload;

      // Check if user with same email already exists
      const existingUser = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        state.error = 'An account with this email already exists.';
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      state.users.push(newUser);
      state.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      state.isAuthenticated = true;
      state.error = null;

      // Sync with localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(state.users));
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },

    loginUser: (state, action) => {
      const { email, password } = action.payload;

      const user = state.users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        state.error = 'Invalid email or password.';
        return;
      }

      state.currentUser = { id: user.id, name: user.name, email: user.email };
      state.isAuthenticated = true;
      state.error = null;

      // Persist active session to localStorage
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;

      // Remove active session from localStorage
      localStorage.removeItem('currentUser');
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
