import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { modifyUrl } from './Data';

register();

export const PageSwiper = ({ pageIdx, ranges, setCount }) => {
  const location = useLocation();
  const swiperElRef = useRef(null);

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
      if (e.detail[0].activeIndex) {
        let pathName = String(location.pathname).split('/');
        pathName[2] = ranges[e.detail[0].activeIndex];
        let newPath = pathName.join('/');
        modifyUrl(location.pathname, newPath);
        setCount(ranges[e.detail[0].activeIndex])
      }
    });

    if (swiperElRef.current && pageIdx) {
      swiperElRef.current.swiper.slideTo(ranges.indexOf(pageIdx));
    }
  }, [ranges, location, pageIdx, setCount]);

  return (
    <swiper-container init='false' ref={swiperElRef}>
      {ranges.map((img, i) => {
        const pageNo = String(img).padStart(3, '0');
        return (
          <swiper-slide key={i}>
            <img
              src={`/imgs/jpg/page${pageNo}.jpg`}
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
  pageIdx: PropTypes.number,
  ranges: PropTypes.array.isRequired,
  setCount: PropTypes.func.isRequired,
};
