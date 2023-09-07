import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
import PropTypes from 'prop-types';

register();
export const PageSwiper = ({ pageIdx, ranges }) => {
  const swiperElRef = useRef(null);

  useEffect(() => {
    const swiperParams = {
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
      console.log(e.detail[0].activeIndex);
      console.log(ranges[e.detail[0].activeIndex]);
      {
        e;
      }
    });
  }, [ranges]);

  const swipeToSlideByIndex = (index) => {
    swiperElRef.current.swiper.slideTo(index);
  };

  if (swiperElRef.current && pageIdx) {
    swipeToSlideByIndex(ranges.indexOf(pageIdx));
  }

  return (
    <swiper-container init='false' ref={swiperElRef}>
      {ranges.map((img, i) => {
        const pageNo = String(img).padStart(3, '0');
        return (
          <swiper-slide key={i}>
            <img
              src={`./imgs/jpg/page${pageNo}.jpg`}
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
};
