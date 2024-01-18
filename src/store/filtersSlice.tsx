import { createSlice } from "@reduxjs/toolkit";

const passportIsGender = localStorage.getItem('passportIsGender')
    ? localStorage.getItem('passportIsGender')
    : '';

const passportName = localStorage.getItem('passportName')
    ? localStorage.getItem('passportName')
    : '';
const requestStatus = localStorage.getItem('requestStatus')
    ? localStorage.getItem('requestStatus')
    : '';

const initialState = {
    passportIsGender,
    passportName,
    requestStatus,
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setPassportIsGender(state, {payload}) {
            state.passportIsGender = payload
            localStorage.setItem('passportIsGender', payload)
        },
        
        setPassportName(state, {payload}) {
            state.passportName = payload
            localStorage.setItem('passportName', payload)
        },
        setRequestStatus(state, {payload}) {
            state.requestStatus = payload
            localStorage.setItem('requestStatus', payload)
        }
    }
})

export default filtersSlice