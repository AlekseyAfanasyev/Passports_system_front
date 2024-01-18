import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser , logoutUser} from "../modules/auth-actions";

const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : '';

const userName = localStorage.getItem('userName')
    ? localStorage.getItem('userName')
    : '';

const userRole = localStorage.getItem('userRole')
    ? localStorage.getItem('userRole')?.toString()
    : '0';

const initialState = {
    loading: false,
    userToken,
    userName,
    userRole,
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        [registerUser.pending.toString()]: (state) => {
            state.loading = true;
            state.error = null
        },
        [registerUser.fulfilled.toString()]: (state) => {
            state.loading = false;
            state.success = true;
        },
        [registerUser.rejected.toString()]: (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        },


        [loginUser.pending.toString()]: (state) => {
            state.loading = true
            state.error = null
        },
        [loginUser.fulfilled.toString()]: (state, {payload}) => {
            state.loading = false
            state.success = true
            state.userToken = payload.access_token
            state.userName = payload.login
        },
        [loginUser.rejected.toString()]: (state, {payload}) => {
            state.loading = false
            state.success = false
            state.error = payload
        },


        [logoutUser.pending.toString()]: (state) => {
            state.loading = true
            state.error = null
        },
        [logoutUser.fulfilled.toString()]: (state) => {
            state.loading = false
            state.success = true;
            state.userToken = ''
            state.userName = ''
            state.userRole = ''
        },
        [logoutUser.rejected.toString()]: (state, {payload}) => {
            state.loading = false
            state.success = false
            state.error = payload
        }
    },
})

export default authSlice.reducer