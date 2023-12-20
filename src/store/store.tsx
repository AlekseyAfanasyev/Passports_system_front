import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from './authSlice'
import cartSlice from './cartSlice'
import filtersSlice from "./filtersSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartSlice.reducer,
        filters: filtersSlice.reducer
    }
})

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;