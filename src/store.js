import { configureStore } from '@reduxjs/toolkit';
import HomeVideoSlice from './State Management/HomeVideoSlice';
import ChannelVidoesSlice from './State Management/ChannelVidoesSlice';

export const Store = configureStore({
    reducer: {
        HomeVideo: HomeVideoSlice,
        ChannelVideos:ChannelVidoesSlice
    }, middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});