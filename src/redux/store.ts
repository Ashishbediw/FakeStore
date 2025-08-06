
import { configureStore } from "@reduxjs/toolkit";
import { StoreApi } from "./api/storeApi";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
    reducer:{
         //cart slice
         cart: cartReducer,
            // Add the RTK Query reducer
         [StoreApi.reducerPath]: StoreApi.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(StoreApi.middleware),
    devTools: true,
})



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;