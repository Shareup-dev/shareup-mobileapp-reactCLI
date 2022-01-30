import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';

let initialState = {};
const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        logOut: () => {
            console.log('log out user here');
        },
        setUser: (state, user) => {
            return state = user
        },
        checkCurrentState: (state) => {
            console.log('current logged in user state: ', state);
            return state;
        },
    }
})
export const loggedInUserActions = userSlice.actions;

export default userSlice;