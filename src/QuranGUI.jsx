import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <DrawerCustomized Data={d} />
        <div style={{ flexGrow: 1 }}>{sura.name}</div>
        <BookmarksBar />
      </div>
      <div style={{ flexShrink: 0 }}>
        Page {pageIndex} Juz {pageData?.Juz} Hez {pageData?.Hez} Rub{' '}
        {pageData?.Rub}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <PageSwiper ranges={range(1, 604)}></PageSwiper>
      </div>
    </div>
  );
};

export default QuranGUI;
