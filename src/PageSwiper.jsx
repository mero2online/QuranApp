import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

register();
export const PageSwiper = () => {
  const swiperElRef = useRef(null);
  useEffect(() => {
    const swiperParams = {
      dir: 'rtl',
      lazy: true,
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
      {
        e;
      }
    });
  }, []);
  const data = range(1, 604);
  return (
    <swiper-container init='false' ref={swiperElRef}>
      {data.map((img, i) => {
        const pageNo = String(img).padStart(3, '0');
        return (
          <swiper-slide key={i} lazy="true">
            <img
              src={`./imgs/page${pageNo}.png`}
              alt='img'
              className='img'
              loading='lazy'
            />
          </swiper-slide>
        );
      })}
    </swiper-container>
  );
};
