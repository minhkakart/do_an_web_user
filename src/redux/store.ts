import appReducer from "~/redux/appReducer";
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: appReducer,
    devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;