import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBookmark,
  deleteBookmarkByPageIndex,
  setBookmarks,
  setSnackBarsOptions,
} from './features/app/appSlice';
import { IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const BookmarksBar = () => {
  const dispatch = useDispatch();
  const { pageIndex, bookmarks, sura, pageData } = useSelector(
    (state) => state.app
  );

  useEffect(() => {
    const localBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (localBookmarks) dispatch(setBookmarks(localBookmarks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMarked = bookmarks.some((b) => b.pageIndex === pageIndex);

  const onClickStar = () => {
    if (isMarked) {
      dispatch(deleteBookmarkByPageIndex(pageIndex));
      dispatch(
        setSnackBarsOptions({
          open: true,
          severity: 'success',
          msg: `Bookmark Page ${pageIndex} Removed`,
        })
      );
    } else {
      dispatch(
        addBookmark({
          pageIndex: pageIndex,
          dateTime: Date.now(),
          sura: sura.name,
          Juz: pageData.Juz,
          Hez: pageData.Hez,
          Rub: pageData.Rub,
        })
      );
      dispatch(
        setSnackBarsOptions({
          open: true,
          severity: 'success',
          msg: `Bookmark Page ${pageIndex} Added Successfully`,
        })
      );
    }
  };

  return (
    <IconButton
      onClick={onClickStar}
      aria-label={isMarked ? 'Remove Bookmark' : 'Add Bookmark'}
      title={isMarked ? 'Remove Bookmark' : 'Add Bookmark'}
      sx={{ color: isMarked ? '#FFD700' : 'inherit' }}
    >
      {isMarked ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
};

export default BookmarksBar;
