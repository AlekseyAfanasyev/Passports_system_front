import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from './authSlice'
import cartSlice from './cartSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartSlice.reducer
    }
})

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;