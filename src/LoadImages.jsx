import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-graceful-image';

const LoadImages = ({ RANGE }) => {
  const [IMAGES, setIMAGES] = useState([]);
  //   const [imgsLoaded, setImgsLoaded] = useState(false);

  useEffect(() => {
    let images = [];
    RANGE.forEach((element) => {
      const pageNo = String(element).padStart(3, '0');
      images.push({
        id: element,
        pageNo: pageNo,
        url: `/quran/imgs/jpg/page${pageNo}.jpg`,
      });
    });
    setIMAGES(images);
  }, [RANGE]);

  return (
    <>
      <div className='images' dir='rtl'>
        {IMAGES.map((image) => (
          <ProgressiveImage
            key={image.id}
            src={image.url}
            placeholder='/quran/imgs/placeholder.jpg'
          >
            {(src, loading) => {
              console.log(loading);
              return <img src={src} alt={image.pageNo} />;
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
