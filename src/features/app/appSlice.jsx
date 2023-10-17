import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageIndex: 0,
  sura: '',
  pageData: {},
  bookmarks: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changePageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setSura: (state, action) => {
      state.sura = action.payload;
    },
    setPageData: (state, action) => {
      state.pageData = action.payload;
    },
    setBookmarks: (state, action) => {
      state.bookmarks = action.payload;
    },
    addBookmark: (state, action) => {
      state.bookmarks = [...state.bookmarks, action.payload];
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },
    deleteBookmark: (state, action) => {
      state.bookmarks.splice(action.payload, 1);
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },
  },
});

export const {
  changePageIndex,
  setSura,
  setPageData,
  setBookmarks,
  addBookmark,
  deleteBookmark,
} = appSlice.actions;

export default appSlice.reducer;
