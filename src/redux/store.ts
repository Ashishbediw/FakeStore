
import { configureStore } from "@reduxjs/toolkit";
import { StoreApi } from "./api/storeApi";

export const store = configureStore({
    reducer:{
         // Add the RTK Query reducer
         [StoreApi.reducerPath]: StoreApi.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(StoreApi.middleware),
})



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;