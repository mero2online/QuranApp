import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LoadImages = ({ IMAGES }) => {
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [imgCount, setImgCount] = useState();

  useEffect(() => {
    const loadImage = (image) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image.url;
        // wait 2 seconds to simulate loading time
        loadImg.onload = () => {
            setImgCount(image.pageNo)
          setTimeout(() => {
            resolve(image.url);
          }, 2000);
        };

        loadImg.onerror = (err) => reject(err);
      });
    };

    Promise.all(IMAGES.map((image) => loadImage(image)))
      .then(() => setImgsLoaded(true))
      .catch((err) => console.log('Failed to load images', err));
  }, [IMAGES]);

  useEffect(() => {
    console.log(imgsLoaded);
  }, [imgsLoaded]);

  return (
    <>
      <div className='images' dir='rtl'>
        {imgsLoaded ? (
          IMAGES.map((image) => (
            <img key={image.id} src={image.url} alt={image.pageNo} />
          ))
        ) : (
          <p>Loading images... {imgCount}</p>
        )}
      </div>
    </>
  );
};

LoadImages.propTypes = {
  IMAGES: PropTypes.array.isRequired,
};

export default LoadImages;
