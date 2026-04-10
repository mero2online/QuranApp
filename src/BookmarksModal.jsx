import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBookmarks,
  deleteBookmark,
  setSnackBarsOptions,
  setSortBookmarksType,
  setSortBookmarksBy,
  sortBookmarks,
  setBookmarksModalOpen,
} from './features/app/appSlice';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const BookmarksModal = () => {
  const dispatch = useDispatch();
  const { bookmarks, sortBookmarksType, sortBookmarksBy, bookmarksModalOpen } =
    useSelector((state) => state.app);

  useEffect(() => {
    const localBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (localBookmarks) dispatch(setBookmarks(localBookmarks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setSortBookmarksType(sortBookmarksType));
    dispatch(setSortBookmarksBy(sortBookmarksBy));
    dispatch(sortBookmarks());
  }, [dispatch, sortBookmarksBy, sortBookmarksType]);

  const onClose = () => dispatch(setBookmarksModalOpen(false));

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

  const renderSortBy = () => {
    const sortByOptions = [
      { name: 'Time', value: 'dateTime' },
      { name: 'Page', value: 'pageIndex' },
    ];

    return sortByOptions.map((o, i) => (
      <Button
        className='MyBtn'
        key={i}
        size='small'
        variant={o.value === sortBookmarksBy ? 'contained' : 'outlined'}
        onClick={() => {
          dispatch(setSortBookmarksType(false));
          dispatch(setSortBookmarksBy(o.value));
          dispatch(sortBookmarks());
        }}
      >
        SortBy {o.name}
      </Button>
    ));
  };

  return (
    <Dialog
      open={bookmarksModalOpen}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>Bookmarks</DialogTitle>
      <DialogContent dividers>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {renderSortBy()}
          <Button
            className='MyBtn'
            size='small'
            variant={sortBookmarksType ? 'contained' : 'outlined'}
            onClick={() => {
              dispatch(setSortBookmarksType(!sortBookmarksType));
              dispatch(sortBookmarks());
            }}
          >
            {sortBookmarksType ? 'Desc' : 'Asc'}
          </Button>
        </div>
        {bookmarks.length === 0 ? (
          <Typography sx={{ mt: 2 }}>No bookmarks yet.</Typography>
        ) : (
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
                        onClick={() => onClickDeleteBtn(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Link
                      to={`/${page.pageIndex}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        flexGrow: 1,
                      }}
                      onClick={onClose}
                    >
                      <ListItemButton sx={{ textAlign: 'left' }}>
                        <ListItemText
                          primary={`${index + 1} - `}
                          sx={{ flex: '0 0 auto', mr: 1, textAlign: 'left' }}
                        />
                        <ListItemText
                          sx={{ textAlign: 'left' }}
                          primary={page.sura}
                          secondary={
                            <>
                              <Typography
                                sx={{ display: 'inline' }}
                                component='span'
                                variant='body2'
                                color='text.primary'
                              >
                                {`Page: ${page.pageIndex} Juz: ${page.Juz} Rub: ${page.Rub}`}
                              </Typography>
                              <Typography
                                component='div'
                                variant='body2'
                                color='text.secondary'
                              >
                                {`Time: ${mDate} ${mTime}`}
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookmarksModal;
