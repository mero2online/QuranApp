import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
import PropTypes from 'prop-types';
import { getImageUrl, modifyUrl } from './Data';
import { useDispatch, useSelector } from 'react-redux';
import { changePageIndex } from './features/app/appSlice';

register();

export const PageSwiper = ({ ranges }) => {
  const swiperElRef = useRef(null);
  const dispatch = useDispatch();
  const pageIndex = useSelector((state) => state.app.pageIndex);

  useEffect(() => {
    const swiperParams = {
      lazy: true,
      dir: 'rtl',
      slidesPerView: 1,
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperElRef.current, swiperParams);

    // and now initialize it
    swiperElRef.current.initialize();

    // listen for Swiper events using addEventListener
    swiperElRef.current.addEventListener('progress', (e) => {
      const [swiper, progress] = e.detail;
      {
        progress, swiper;
      }
    });

    swiperElRef.current.addEventListener('slidechange', (e) => {
      if (e.detail[0].activeIndex !== undefined) {
        let pathName = String(window.location.pathname).split('/');
        pathName[2] = ranges[e.detail[0].activeIndex];
        let newPath = pathName.join('/');
        if (location.pathname !== newPath) {
          dispatch(changePageIndex(ranges[e.detail[0].activeIndex]));
          modifyUrl(location.pathname, newPath);
        }
      }
    });

    if (swiperElRef.current && pageIndex) {
      swiperElRef.current.swiper.slideTo(ranges.indexOf(pageIndex));
    }
  }, [ranges, dispatch, pageIndex]);

  return (
    <swiper-container init='false' ref={swiperElRef}>
      {ranges.map((img, i) => {
        const pageNo = String(img).padStart(3, '0');
        return (
          <swiper-slide key={i}>
            <img
              src={getImageUrl(`imgs/jpg/page${pageNo}.jpg`)}
              alt={`page${pageNo}`}
              className='img'
              loading='lazy'
              onLoad={() => {
                console.log('loaded');
              }}
            />
          </swiper-slide>
        );
      })}
    </swiper-container>
  );
};

PageSwiper.propTypes = {
  ranges: PropTypes.array.isRequired,
};
