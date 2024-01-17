import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
    passports: string[];
    added: boolean;
  }

  const initialState: CartState = {
    passports: localStorage.getItem('passports')
      ? localStorage.getItem('passports')?.split(',')|| []
      : [],
    added: false,
  };

  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      addPassport(state, { payload }: PayloadAction<string>) {
        if (!state.passports.includes(payload)) {
          state.passports.push(payload);
          localStorage.setItem('passports', state.passports.toString());
        }
        state.added = true;
      },
      removePassport(state, { payload }: PayloadAction<string>) {
        const passportIndex = state.passports.indexOf(payload);
        if (passportIndex > -1) {
          state.passports.splice(passportIndex, 1);
          localStorage.setItem('passports', state.passports.toString());
        }
      },
      disableAdded(state) {
        state.added = false;
      },
      setPassports(state, { payload }: PayloadAction<string[]>) {
  
        state.passports = Array.from(new Set([...state.passports, ...payload]));
        localStorage.setItem('passports', state.passports.toString());
      },
    },
  });
  export default cartSlice;