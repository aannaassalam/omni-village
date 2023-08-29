import {configureStore} from '@reduxjs/toolkit';
import {AuthSlice} from '../Redux/AuthSlice';
import {CultivationSlice} from '../Redux/CultivationSlice';
import {CropSlice} from '../Redux/CropSlice';

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    cultivation: CultivationSlice.reducer,
    crop: CropSlice.reducer,
  },
});
