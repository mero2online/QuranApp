import { useCallback, useState } from 'react';
import { getImageUrl, range } from './Data';

const TOTAL_PAGES = 604;
const CONCURRENCY = 6;

export const useOfflineDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    if (downloading) return;
    setError(null);
    setDone(0);
    setTotal(TOTAL_PAGES);
    setDownloading(true);

    const urls = range(1, TOTAL_PAGES).map((p) =>
      getImageUrl(`imgs/jpg/page${String(p).padStart(3, '0')}.jpg`)
    );

    let cursor = 0;
    let failed = 0;

    const worker = async () => {
      while (cursor < urls.length) {
        const i = cursor++;
        try {
          const res = await fetch(urls[i], { cache: 'reload' });
          if (!res.ok) failed++;
        } catch {
          failed++;
        }
        setDone((d) => d + 1);
      }
    };

    try {
      await Promise.all(
        Array.from({ length: CONCURRENCY }, () => worker())
      );
      if (failed > 0) {
        setError(`${failed} page(s) failed to download`);
      }
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  return { downloading, done, total, error, start };
};
