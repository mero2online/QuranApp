import { useRef, useEffect, useState } from 'react';
import { register } from 'swiper/element/bundle';
import PropTypes from 'prop-types';
import { getImageUrl, modifyUrl } from './Data';
import { useDispatch, useSelector } from 'react-redux';
import { changePageIndex } from './features/app/appSlice';

register();

// How many neighboring slides (on each side of active) actually mount an <img>.
// Keeping this small is critical on iOS Safari, which crashes when too many
// large JPGs are decoded in memory at once.
const PRELOAD_NEIGHBORS = 1;

export const PageSwiper = ({ ranges }) => {
  const swiperElRef = useRef(null);
  const dispatch = useDispatch();
  const pageIndex = useSelector((state) => state.app.pageIndex);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, ranges.indexOf(pageIndex))
  );

  // Initialize swiper exactly once.
  useEffect(() => {
    const el = swiperElRef.current;
    if (!el) return;

    const swiperParams = {
      dir: 'rtl',
      slidesPerView: 1,
    };
    Object.assign(el, swiperParams);
    el.initialize();

    const onSlideChange = (e) => {
      const idx = e.detail[0].activeIndex;
      if (idx === undefined) return;
      setActiveIndex(idx);
      const newPage = ranges[idx];
      let pathName = String(window.location.pathname).split('/');
      pathName[2] = newPage;
      const newPath = pathName.join('/');
      if (location.pathname !== newPath) {
        dispatch(changePageIndex(newPage));
        modifyUrl(location.pathname, newPath);
        localStorage.setItem('lastPage', newPage);
      }
    };

    el.addEventListener('slidechange', onSlideChange);
    return () => {
      el.removeEventListener('slidechange', onSlideChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync swiper to external pageIndex changes (e.g. router navigation).
  useEffect(() => {
    const el = swiperElRef.current;
    if (!el || !el.swiper) return;
    const targetIdx = ranges.indexOf(pageIndex);
    if (targetIdx >= 0 && targetIdx !== el.swiper.activeIndex) {
      el.swiper.slideTo(targetIdx, 0);
      setActiveIndex(targetIdx);
    }
  }, [pageIndex, ranges]);

  return (
    <swiper-container init='false' ref={swiperElRef}>
      {ranges.map((img, i) => {
        const pageNo = String(img).padStart(3, '0');
        const shouldRender = Math.abs(i - activeIndex) <= PRELOAD_NEIGHBORS;
        return (
          <swiper-slide key={i}>
            {shouldRender ? (
              <img
                src={getImageUrl(`imgs/jpg/page${pageNo}.jpg`)}
                alt={`page${pageNo}`}
                className='img'
                loading='lazy'
                decoding='async'
              />
            ) : null}
          </swiper-slide>
        );
      })}
    </swiper-container>
  );
};

PageSwiper.propTypes = {
  ranges: PropTypes.array.isRequired,
};
