import { useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  getAyahGlyphs,
  getGlyphImageWidth,
  loadDatabases,
} from './db/quranDb';

const AyahHighlightOverlay = ({ pageNo, imgRef, slideRef, imgLoaded }) => {
  const highlightVerse = useSelector((s) => s.app.highlightVerse);
  const [glyphs, setGlyphs] = useState([]);
  const [rect, setRect] = useState(null);

  const active =
    highlightVerse && Number(highlightVerse.pageNumber) === Number(pageNo);

  useEffect(() => {
    if (!active) {
      setGlyphs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await loadDatabases();
        if (cancelled) return;
        const g = getAyahGlyphs(pageNo, highlightVerse.sura, highlightVerse.ayah);
        if (cancelled) return;
        setGlyphs(g);
      } catch (err) {
        console.error('Failed to load glyphs:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active, pageNo, highlightVerse]);

  const recompute = () => {
    const img = imgRef?.current;
    const slide = slideRef?.current;
    if (!active || !img || !slide) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh) return;
    const box = slide.getBoundingClientRect();
    const sw = box.width;
    const sh = box.height;
    if (!sw || !sh) return;

    // Glyph coords live in a larger reference image space (the DB is authored
    // against the "large" quality page images). We derive the reference width
    // from the glyph DB's horizontal extents (symmetric Mushaf margins) and the
    // reference height from our JPG's aspect ratio (same source, scaled down).
    const glyphW = getGlyphImageWidth();
    if (!glyphW) return;
    const glyphH = glyphW * (nh / nw);

    // object-fit: contain — compute the displayed image box inside the slide.
    const displayScale = Math.min(sw / nw, sh / nh);
    const dispW = nw * displayScale;
    const dispH = nh * displayScale;

    // Glyph-coord → on-screen-pixel scale.
    const gx = dispW / glyphW;
    const gy = dispH / glyphH;

    setRect({
      gx,
      gy,
      offsetX: (sw - dispW) / 2,
      offsetY: (sh - dispH) / 2,
    });
  };

  useLayoutEffect(() => {
    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, imgLoaded, glyphs]);

  useEffect(() => {
    if (!active) return;
    const slide = slideRef?.current;
    if (!slide || typeof ResizeObserver === 'undefined') {
      const onResize = () => recompute();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    const ro = new ResizeObserver(() => recompute());
    ro.observe(slide);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, slideRef]);

  if (!active || !glyphs.length || !rect) return null;

  const { gx, gy, offsetX, offsetY } = rect;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {glyphs.map((g, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: offsetX + g.min_x * gx,
            top: offsetY + g.min_y * gy,
            width: (g.max_x - g.min_x) * gx,
            height: (g.max_y - g.min_y) * gy,
            backgroundColor: 'rgba(255, 165, 0, 0.35)',
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

AyahHighlightOverlay.propTypes = {
  pageNo: PropTypes.number.isRequired,
  imgRef: PropTypes.object.isRequired,
  slideRef: PropTypes.object.isRequired,
  imgLoaded: PropTypes.bool,
};

export default AyahHighlightOverlay;
