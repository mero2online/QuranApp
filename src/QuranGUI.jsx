import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSuraNumberFromURL, pagesData, range, suraDataLinks } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const d = suraDataLinks();
import { useDispatch, useSelector } from 'react-redux';
import { changePageIndex, setSura, setPageData } from './features/app/appSlice';
import BookmarksBar from './BookmarksBar';

const QuranGUI = () => {
  const dispatch = useDispatch();
  const { pageIndex, sura, pageData } = useSelector((state) => state.app);
  let { PageNo } = useParams();

  useEffect(() => {
    if (PageNo) {
      dispatch(changePageIndex(Number(PageNo)));
    }
  }, [PageNo, dispatch]);
  useEffect(() => {
    const SuraNumber = getSuraNumberFromURL(d);
    const pData = pagesData(pageIndex);
    dispatch(setSura(d[SuraNumber[0].id]));
    if (pData) dispatch(setPageData(pData.at(-1)));
  }, [pageIndex, dispatch]);

  return (
    <>
      <Link to='/'>
        <button className='MyBtn'>Home</button>
      </Link>
      <Link to='/ranges'>
        <button className='MyBtn'>Ranges</button>
      </Link>
      <BookmarksBar />
      <DrawerCustomized Data={d} />
      <div>
        <div>
          Juz {pageData?.Juz} Hez {pageData?.Hez} Rub {pageData?.Rub}
        </div>
        <div>Current Page {pageIndex}</div>
        <div>{sura.name}</div>
      </div>
      <PageSwiper ranges={range(1, 604)}></PageSwiper>
    </>
  );
};

export default QuranGUI;
