import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSuraNumberFromURL, pagesData, range, suraDataLinks } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const d = suraDataLinks();
import { useDispatch, useSelector } from 'react-redux';
import { changePageIndex } from './features/app/appSlice';

const QuranGUI = () => {
  const dispatch = useDispatch();
  const pageIndex = useSelector((state) => state.app.pageIndex);
  let { PageNo } = useParams();
  const [sura, setSura] = useState('');
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    if (PageNo) {
      dispatch(changePageIndex(Number(PageNo)));
    }
  }, [PageNo, dispatch]);
  useEffect(() => {
    const SuraNumber = getSuraNumberFromURL(d);
    const pData = pagesData(pageIndex);
    setSura(d[SuraNumber[0].id]);
    setPageData(pData.at(-1))
  }, [pageIndex]);

  return (
    <>
      <Link to='/'>
        <button>Home</button>
      </Link>
      <DrawerCustomized Data={d} />
      <div>
        <div>Juz {pageData.Juz} Hez {pageData.Hez} Rub {pageData.Rub}</div>
        <div>Current Page {pageIndex}</div>
        <div>{sura.name}</div>
      </div>
      <PageSwiper ranges={range(1, 604)}></PageSwiper>
    </>
  );
};

export default QuranGUI;
