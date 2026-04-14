import { useRef, useEffect, useState } from 'react';
import { register } from 'swiper/element/bundle';
import PropTypes from 'prop-types';
import { getImageUrl, modifyUrl } from './Data';
import { useDispatch, useSelector } from 'react-redux';
import { changePageIndex, clearHighlight } from './features/app/appSlice';
import AyahHighlightOverlay from './AyahHighlightOverlay';

register();

// How many neighboring slides (on each side of active) actually mount an <img>.
// Keeping this small is critical on iOS Safari, which crashes when too many
// large JPGs are decoded in memory at once.
const PRELOAD_NEIGHBORS = 1;

const PageSlide = ({ pageNumber, shouldRender }) => {
  const imgRef = useRef(null);
  const slideRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const pageNo = String(pageNumber).padStart(3, '0');

  return (
    <div
      ref={slideRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {shouldRender ? (
        <>
          <img
            ref={imgRef}
            src={getImageUrl(`imgs/jpg/page${pageNo}.jpg`)}
            alt={`page${pageNo}`}
            className='img'
            loading='lazy'
            decoding='async'
            onLoad={() => setLoaded(true)}
          />
          <AyahHighlightOverlay
            pageNo={pageNumber}
            imgRef={imgRef}
            slideRef={slideRef}
            imgLoaded={loaded}
          />
        </>
      ) : null}
    </div>
  );
};

PageSlide.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  shouldRender: PropTypes.bool.isRequired,
};

const readPageFromUrl = (ranges) => {
  try {
    const parts = String(window.location.pathname).split('/');
    const last = Number(parts[parts.length - 1]);
    const idx = ranges.indexOf(last);
    if (idx >= 0) return idx;
  } catch {
    /* ignore */
  }
  return -1;
};

export const PageSwiper = ({ ranges }) => {
  const swiperElRef = useRef(null);
  const dispatch = useDispatch();
  const pageIndex = useSelector((state) => state.app.pageIndex);
  const highlightVerseRef = useRef(null);
  const highlightVerse = useSelector((state) => state.app.highlightVerse);
  const [activeIndex, setActiveIndex] = useState(() => {
    // URL is the source of truth on first mount — Redux pageIndex may still
    // be stale from a previous visit, which would otherwise trigger a wrong
    // slideTo during initialization and clobber highlight state.
    const urlIdx = readPageFromUrl(ranges);
    if (urlIdx >= 0) return urlIdx;
    return Math.max(0, ranges.indexOf(pageIndex));
  });

  useEffect(() => {
    highlightVerseRef.current = highlightVerse;
  }, [highlightVerse]);

  // Flag set just before any programmatic slideTo. While set, slidechange
  // events are treated as stale (Swiper fires the event with its pre-slideTo
  // activeIndex, not the target) and must NOT rewrite URL/Redux or clear
  // highlights. Genuine user swipes happen outside this window.
  const programmaticSlideRef = useRef(false);

  // Initialize swiper exactly once.
  useEffect(() => {
    const el = swiperElRef.current;
    if (!el) return;

    const swiperParams = {
      dir: 'rtl',
      slidesPerView: 1,
      initialSlide: activeIndex,
    };
    Object.assign(el, swiperParams);
    el.initialize();

    const onSlideChange = (e) => {
      const idx = e.detail[0].activeIndex;
      if (idx === undefined) return;
      // Always keep local windowing in sync with whatever Swiper reports.
      setActiveIndex(idx);
      if (programmaticSlideRef.current) {
        // Stale/in-flight event from a programmatic slideTo — don't touch
        // URL, Redux, or highlight.
        return;
      }
      const newPage = ranges[idx];
      let pathName = String(window.location.pathname).split('/');
      pathName[2] = newPage;
      const newPath = pathName.join('/');
      if (location.pathname !== newPath) {
        dispatch(changePageIndex(newPage));
        modifyUrl(location.pathname, newPath);
        localStorage.setItem('lastPage', newPage);
        const hv = highlightVerseRef.current;
        if (hv && Number(hv.pageNumber) !== Number(newPage)) {
          dispatch(clearHighlight());
        }
      }
    };

    el.addEventListener('slidechange', onSlideChange);
    return () => {
      el.removeEventListener('slidechange', onSlideChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync swiper to external pageIndex changes (e.g. router navigation).
  // Skipped on first render because Redux pageIndex may still be stale from
  // the previous visit — the URL (via activeIndex initializer + initialSlide)
  // is the source of truth at mount time.
  const firstSyncRunRef = useRef(true);
  useEffect(() => {
    if (firstSyncRunRef.current) {
      firstSyncRunRef.current = false;
      return;
    }
    const el = swiperElRef.current;
    if (!el || !el.swiper) return;
    const targetIdx = ranges.indexOf(pageIndex);
    if (targetIdx >= 0 && targetIdx !== el.swiper.activeIndex) {
      programmaticSlideRef.current = true;
      el.swiper.slideTo(targetIdx, 0);
      setActiveIndex(targetIdx);
      // Clear the flag after a generous window so any queued slidechange
      // events from Swiper fire while it's still set.
      setTimeout(() => {
        programmaticSlideRef.current = false;
      }, 500);
    }
  }, [pageIndex, ranges]);

  return (
    <swiper-container init='false' ref={swiperElRef}>
      {ranges.map((img, i) => {
        const shouldRender = Math.abs(i - activeIndex) <= PRELOAD_NEIGHBORS;
        return (
          <swiper-slide key={i}>
            <PageSlide pageNumber={img} shouldRender={shouldRender} />
          </swiper-slide>
        );
      })}
    </swiper-container>
  );
};

PageSwiper.propTypes = {
  ranges: PropTypes.array.isRequired,
};
