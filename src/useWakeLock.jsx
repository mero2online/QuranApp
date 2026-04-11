import { useEffect, useRef } from 'react';

// Keeps the screen awake for `durationMs` each time `resetKey` changes.
// After the timeout expires, the lock is released and the screen can sleep.
// Also re-acquires the lock if the page becomes visible again before expiry.
export const useWakeLock = (resetKey, durationMs = 5 * 60 * 1000) => {
  const lockRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!('wakeLock' in navigator)) return;

    let cancelled = false;

    const release = async () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (lockRef.current) {
        try {
          await lockRef.current.release();
        } catch {
          // ignore
        }
        lockRef.current = null;
      }
    };

    const acquire = async () => {
      if (cancelled) return;
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
        lockRef.current.addEventListener('release', () => {
          lockRef.current = null;
        });
      } catch {
        // user denied / unsupported / document not visible
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && timerRef.current) {
        // Timer still running — re-acquire if browser dropped the lock.
        if (!lockRef.current) acquire();
      }
    };

    release().then(() => {
      if (cancelled) return;
      acquire();
      timerRef.current = setTimeout(() => {
        release();
      }, durationMs);
    });

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      release();
    };
  }, [resetKey, durationMs]);
};
