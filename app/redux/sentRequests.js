import { createSlice } from "@reduxjs/toolkit";

let initialState = [];

const sentRequestSlice = createSlice({
  name: "sentRequestSlice",
  initialState,
  reducers: {
    setList: (state, newState) => {

      return (state = newState.payload);
    },
    removeFriend: () => {
      console.log("friend removed");
    },
    getList: (state) => {
      return state.payload;
    },
  },
});

export const sentRequestsActions = sentRequestSlice.actions;

export default sentRequestSlice.reducer;
