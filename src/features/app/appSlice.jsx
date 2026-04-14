import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageIndex: 0,
  sura: '',
  pageData: {},
  bookmarks: [],
  bookmarksModalOpen: false,
  snackBarsOptions: { open: false, severity: 'success', msg: 'success' },
  sortBookmarksBy: 'dateTime',
  sortBookmarksType: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,
  highlightVerse: null,
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
    deleteBookmarkByPageIndex: (state, action) => {
      state.bookmarks = state.bookmarks.filter(
        (b) => b.pageIndex !== action.payload
      );
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },
    setBookmarksModalOpen: (state, action) => {
      state.bookmarksModalOpen = action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    sortBookmarks: (state, _action) => {
      state.bookmarks = state.bookmarks.sort((a, b) => {
        const one = a[state.sortBookmarksBy];
        const two = b[state.sortBookmarksBy];
        return state.sortBookmarksType ? two - one : one - two;
      });
    },
    setSortBookmarksBy: (state, action) => {
      state.sortBookmarksBy = action.payload;
    },
    setSortBookmarksType: (state, action) => {
      state.sortBookmarksType = action.payload;
    },
    setSnackBarsOptions: (state, action) => {
      state.snackBarsOptions = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setSearchError: (state, action) => {
      state.searchError = action.payload;
    },
    setHighlightVerse: (state, action) => {
      state.highlightVerse = action.payload;
    },
    clearHighlight: (state) => {
      state.highlightVerse = null;
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
  deleteBookmarkByPageIndex,
  setBookmarksModalOpen,
  sortBookmarks,
  setSortBookmarksBy,
  setSortBookmarksType,
  setSnackBarsOptions,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setSearchError,
  setHighlightVerse,
  clearHighlight,
} = appSlice.actions;

export default appSlice.reducer;
