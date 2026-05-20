import { useEffect, useRef, useState } from 'react';
import { resolveCode } from '../services/api';

type RedirectStatus = 'loading' | 'ready' | 'missing' | 'error';

export const useRedirect = (shortId: string) => {
  const [status, setStatus] = useState<RedirectStatus>('loading');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const resolvedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');
    setOriginalUrl(null);
    setSecondsLeft(5);
    resolvedUrlRef.current = null;

    resolveCode(shortId)
      .then((data) => {
        if (!isMounted) return;
        setOriginalUrl(data.originalUrl);
        resolvedUrlRef.current = data.redirectUrl;
        setStatus('ready');
      })
      .catch((err) => {
        if (!isMounted) return;
        setStatus(err.response?.status === 404 ? 'missing' : 'error');
      });

    return () => {
      isMounted = false;
    };
  }, [shortId]);

  useEffect(() => {
    if (status !== 'ready' || !resolvedUrlRef.current) return;

    const countdown = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    const redirect = window.setTimeout(() => {
      if (resolvedUrlRef.current) {
        window.location.replace(resolvedUrlRef.current);
      }
    }, 5000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [status]);

  return {
    status,
    originalUrl,
    redirectUrl: resolvedUrlRef.current,
    secondsLeft,
  };
};
