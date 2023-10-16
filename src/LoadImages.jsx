import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-graceful-image';
import { getImageUrl } from './Data';

const LoadImages = ({ RANGE }) => {
  const [IMAGES, setIMAGES] = useState([]);
  // const [loaded, setLoaded] = useState({});
  useEffect(() => {
    let images = [];
    RANGE.forEach((element) => {
      const pageNo = String(element).padStart(3, '0');
      images.push({
        id: element,
        pageNo: pageNo,
        url: getImageUrl(`imgs/jpg/page${pageNo}.jpg`),
      });
    });
    setIMAGES(images);
  }, [RANGE]);
  function onSrcChange(s) {
    console.log(s);
    // setLoaded({[s]: 'OK'})
  }
  const onRefChange = useCallback((node) => {
    if (node === null) {
      // DOM node referenced by ref has been unmounted
    } else {
      // DOM node referenced by ref has changed and exists
      const interval = setInterval(function () {
        const two = String(node.src).split('/');
        if (two[two.length - 1] !== 'placeholder.jpg') {
          onSrcChange(two[two.length - 1]);
          clearInterval(interval);
        }
      }, 1000); // 1000ms = 1s
    }
  }, []); // adjust deps
  return (
    <>
      <div className='images' dir='rtl'>
        {/* <div>
          {loaded &&
            Object.keys(loaded).map((k, i) => {
              return (
                <div key={i}>
                  {String(loaded)[k]}:{k}
                </div>
              );
            })}
        </div> */}
        {IMAGES.map((image) => (
          <ProgressiveImage
            key={image.id}
            src={image.url}
            // placeholder='/quran/imgs/placeholder.jpg'
            placeholder={getImageUrl('imgs/placeholder.jpg')}
          >
            {(src, loading) => {
              return (
                <img
                  ref={onRefChange}
                  style={{ opacity: loading ? 0.5 : 1 }}
                  src={src}
                  alt={image.pageNo}
                  width='5%'
                  height='5%'
                />
              );
            }}
          </ProgressiveImage>
        ))}
      </div>
    </>
  );
};
LoadImages.propTypes = {
  RANGE: PropTypes.array.isRequired,
};
export default LoadImages;
