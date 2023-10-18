import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBookmarks,
  deleteBookmark,
  setSnackBarsOptions,
  setSortBookmarksType,
  setSortBookmarksBy,
  sortBookmarks,
} from './features/app/appSlice';
import { Link } from 'react-router-dom';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const BookmarksPage = () => {
  const dispatch = useDispatch();
  const { bookmarks, sortBookmarksType } = useSelector((state) => state.app);

  useEffect(() => {
    const localBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (localBookmarks) dispatch(setBookmarks(localBookmarks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onClickDeleteBtn = (index) => {
    dispatch(deleteBookmark(index));
    dispatch(
      setSnackBarsOptions({
        open: true,
        severity: 'success',
        msg: `Bookmark ${index + 1} Deleted Successfully`,
      })
    );
  };
  return (
    <div>
      <Link to='/'>
        <button>Home</button>
      </Link>
      <div>
        <button
          onClick={() => {
            dispatch(setSortBookmarksType(false));
            dispatch(setSortBookmarksBy('dateTime'));
            dispatch(sortBookmarks());
          }}
        >
          SortBy DT
        </button>
        <button
          onClick={() => {
            dispatch(setSortBookmarksType(false));
            dispatch(setSortBookmarksBy('pageIndex'));
            dispatch(sortBookmarks());
          }}
        >
          SortBy Page
        </button>
        <button
          onClick={() => {
            dispatch(setSortBookmarksType(!sortBookmarksType));
            dispatch(sortBookmarks());
          }}
          style={{ background: sortBookmarksType ? '#1290ca' : 'gray' }}
        >
          {sortBookmarksType ? 'D' : 'A'}
        </button>
      </div>
      <List>
        {bookmarks.map((page, index) => {
          const mDate = new Date(page.dateTime).toLocaleDateString('en-GB');
          const mTime = new Date(page.dateTime).toLocaleTimeString('en-US');
          return (
            <div key={index}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    sx={{ color: 'red' }}
                    onClick={() => {
                      onClickDeleteBtn(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Link
                  to={`/${page.pageIndex}`}
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  <ListItemButton>
                    <ListItemText
                      primary={`${index + 1} - `}
                      style={{ marginRight: 5 }}
                    />
                    <ListItemText
                      primary={page.sura}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: 'inline' }}
                            component='span'
                            variant='body2'
                            // color='text.primary'
                            color='white'
                          >
                            {`Page: ${page.pageIndex} Juz: ${page.Juz} Rub: ${page.Rub}`}
                          </Typography>
                          <Typography
                            component='div'
                            variant='body2'
                            color='gray'
                            // color='text.primary'
                          >
                            {`DT: ${mDate} ${mTime}`}
                          </Typography>
                        </>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
    </div>
  );
};

export default BookmarksPage;