import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEvents, getEventById } from '../services/ticketmasterApi';

// Async thunk to fetch events list with search/filter parameters
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getEvents(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch events.');
    }
  }
);

// Async thunk to fetch single event details by ID
export const fetchEventDetails = createAsyncThunk(
  'events/fetchEventDetails',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getEventById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch event details.');
    }
  }
);

const initialState = {
  items: [],
  selectedEvent: null,
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
  filters: {
    keyword: '',
    classificationName: 'All',
    sort: 'date,asc',
  },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilterKeyword: (state, action) => {
      state.filters.keyword = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filters.classificationName = action.payload;
    },
    setFilterSort: (state, action) => {
      state.filters.sort = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchEventDetails
      .addCase(fetchEventDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedEvent = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      });
  },
});

export const {
  setFilterKeyword,
  setFilterCategory,
  setFilterSort,
  resetFilters,
  clearSelectedEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
