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

    const reqStartDate = localStorage.getItem('reqStartDate')
    ? localStorage.getItem('reqStartDate')
    : '';
const reqFinDate = localStorage.getItem('reqFinDate')
    ? localStorage.getItem('reqFinDate')
    : '';

    const reqClient = localStorage.getItem('reqClient')
    ? localStorage.getItem('reqClient')
    : '';

const initialState = {
    passportIsGender,
    passportName,
    requestStatus,
    reqStartDate,
    reqFinDate,
    reqClient
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
        },
        setReqStartDate(state, { payload }) {
            state.reqStartDate = payload
            localStorage.setItem('reqStartDate', payload)
        },
        setReqFinDate(state, { payload }) {
            state.reqFinDate = payload
            localStorage.setItem('ReqFinDate', payload)
        },
        setReqClient(state, {payload}) {
            state.reqClient = payload
            localStorage.setItem('reqClient', payload)
        }
    }
})

export default filtersSlice