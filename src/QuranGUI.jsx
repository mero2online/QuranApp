import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { range, suraDataLinks } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const d = suraDataLinks();
import { useDispatch, useSelector } from 'react-redux';
import { changePageIndex } from './features/app/appSlice';

const QuranGUI = () => {
  const dispatch = useDispatch();
  const pageIndex = useSelector((state) => state.app.pageIndex);
  let { PageNo } = useParams();

  useEffect(() => {
    if (PageNo) {
      dispatch(changePageIndex(Number(PageNo)));
    }
  }, [PageNo, dispatch]);

  return (
    <>
      <Link to='/'>
        <button>Home</button>
      </Link>
      <DrawerCustomized Data={d} />
      <div>
        <div>Current Page {pageIndex}</div>
      </div>
      <PageSwiper ranges={range(1, 604)}></PageSwiper>
    </>
  );
};

export default QuranGUI;
