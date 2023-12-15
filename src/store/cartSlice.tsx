import { createSlice } from "@reduxjs/toolkit"

const passports = localStorage.getItem('passports')
    ? localStorage.getItem('passports')?.split(',')
    : [];

const initialState = {
    passports,
    added: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addPassport(state, {payload}) {
            if (state.passports == null) {
                state.passports = []
            }

            if (state.passports.indexOf(payload.toString()) === -1) {
                state.passports.push(payload.toString())
                localStorage.setItem('passports', state.passports.toString())
            }
            state.added = true

        },
        removePassport(state, {payload}) {
            if (state.passports == null) {
                state.passports = []
            }

            if (state.passports.length == 0) {
                return
            }

            const passportIndex = state.passports.indexOf(payload.toString())
            if (passportIndex > -1) {
                state.passports.splice(passportIndex, 1)
                localStorage.setItem('passports', state.passports.toString())
            }
        },
        disableAdded(state) {
            state.added = false
        }
    }
})

export default cartSlice