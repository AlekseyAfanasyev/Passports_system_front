import { createSlice } from "@reduxjs/toolkit";

const requestStatus = localStorage.getItem('requestStatus')
    ? localStorage.getItem('requestStatus')
    : '';

const initialState = {
    requestStatus,
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setRequestStatus(state, {payload}) {
            state.requestStatus = payload
            localStorage.setItem('requestStatus', payload)
        }
    }
})

export default filtersSlice