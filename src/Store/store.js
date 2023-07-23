import {configureStore} from '@reduxjs/toolkit';
import {AuthSlice} from '../Redux/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
  },
});
