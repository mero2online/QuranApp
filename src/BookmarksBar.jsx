import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, setBookmarks } from './features/app/appSlice';
import { useNavigate } from 'react-router-dom';

const BookmarksBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageIndex, bookmarks, sura, pageData } = useSelector(
    (state) => state.app
  );

  useEffect(() => {
    const localBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (localBookmarks) dispatch(setBookmarks(localBookmarks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickAdd = () => {
    if (!bookmarks.includes(pageIndex))
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
  };
  const onClickLoad = () => {
    navigate('/bookmarks');
  };

  return (
    <div>
      <button onClick={onClickAdd}>Add Bookmark</button>
      <button onClick={onClickLoad}>Load Bookmark</button>
    </div>
  );
};

export default BookmarksBar;
