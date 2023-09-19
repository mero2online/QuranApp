import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageIndex: 0,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changePageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
  },
});

export const { changePageIndex } = appSlice.actions;

export default appSlice.reducer;
