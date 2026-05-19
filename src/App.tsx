import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import UrlForm from './components/UrlForm';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import { getRedirectUrl, getUrlStats, shortenUrl, ShortenResponse } from './services/api';

const getShortCodeFromPath = () => {
  const match = window.location.pathname.match(/^\/short\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const RedirectView: React.FC<{ shortId: string }> = ({ shortId }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    getUrlStats(shortId)
      .then((data) => {
        if (!isMounted) return;
        setTargetUrl(data.originalUrl);
        setRedirectUrl(getRedirectUrl(shortId));
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
    if (status !== 'ready' || !redirectUrl) return;

    const countdown = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    const redirect = window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 5000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [status, redirectUrl]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_14%,#99f6e4_0,#f8fafc_28%,#dbeafe_58%,#fff7ed_100%)] text-slate-950">
      <div className="scene-3d pointer-events-none absolute inset-0">
        <div className="orb-3d orb-emerald" />
        <div className="orb-3d orb-sky" />
        <div className="orb-3d orb-orange" />
        <div className="grid-3d" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-5 py-10">
        <div className="animate-rise mb-8 flex items-center gap-3">
          <img className="animate-float h-12 w-12 rounded-lg shadow-sm" src="/brand-shortener.svg" alt="Logo Corto&Sencillo" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">Corto&Sencillo</p>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">Redireccionando enlace</h1>
          </div>
        </div>

        {status === 'loading' && (
          <div className="redirect-card-3d animate-rise rounded-2xl border border-white/70 bg-white/82 p-7 shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="verify-device">
                <div className="verify-device-screen">
                  <ShieldCheck className="h-12 w-12 text-emerald-600" />
                  <span />
                </div>
              </div>
              <Loader label="Verificando que el enlace exista..." />
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Estamos consultando la informacion del codigo antes de enviarte al destino.
              </p>
            </div>
          </div>
        )}

        {status === 'ready' && targetUrl && (
          <div className="redirect-card-3d animate-rise rounded-2xl border border-white/70 bg-white/84 p-7 shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
              <div className="countdown-orbit">
                <div className="countdown-ring" style={{ '--progress': `${(secondsLeft / 5) * 360}deg` } as React.CSSProperties}>
                  <div className="countdown-core">
                    <span>{secondsLeft}</span>
                    <small>seg</small>
                  </div>
                </div>
                <div className="orbit-dot orbit-dot-one" />
                <div className="orbit-dot orbit-dot-two" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Enlace verificado
                </div>
                <h2 className="max-w-2xl text-3xl font-black tracking-normal text-slate-950 md:text-5xl">
                  Preparando tu salto seguro
                </h2>
                <p className="mt-3 text-base font-semibold text-slate-700">
                  Te llevaremos al destino en {secondsLeft} segundos.
                </p>
                <p className="mt-3 break-all text-sm leading-6 text-slate-600">{targetUrl}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={redirectUrl || targetUrl}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                  >
                    Abrir ahora
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Crear otro enlace
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {(status === 'missing' || status === 'error') && (
          <div className="redirect-card-3d animate-rise rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-7 shadow-2xl shadow-orange-900/10">
            <div className="flex gap-4">
              <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-amber-700" />
              <div>
                <h2 className="text-2xl font-bold text-amber-950">
                  {status === 'missing' ? 'La pagina no existe' : 'No pudimos verificar el enlace'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  El codigo <strong>{shortId}</strong> no tiene una URL registrada o el servicio de estadisticas no respondio.
                </p>
                <a
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al formulario
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

const App: React.FC = () => {
  const shortIdFromPath = useMemo(getShortCodeFromPath, []);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (shortIdFromPath) {
    return <RedirectView shortId={shortIdFromPath} />;
  }

  const handleShorten = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await shortenUrl(url);
      const shortUrl = `${window.location.origin}/short/${encodeURIComponent(data.shortId)}`;
      const resultData = { ...data, shortUrl };
      setResult(resultData);

      if (resultData.shortUrl) {
        try {
          await navigator.clipboard.writeText(resultData.shortUrl);
        } catch (err) {
          console.warn('Auto copy failed, manual copy is still available', err);
        }
      }
    } catch (err: any) {
      console.error('Error shortening URL:', err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Ocurrio un error al acortar la URL. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_15%,#bbf7d0_0,#f8fafc_28%,#e0f2fe_56%,#fff7ed_100%)] p-4 text-slate-950">
      <div className="animate-gradient-x pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-sky-500 to-orange-400" />
      <div className="z-10 w-full max-w-lg space-y-8">
        <div className="animate-rise space-y-3 text-center">
          <img
            className="animate-float mx-auto mb-2 h-20 w-20 rounded-2xl shadow-lg shadow-emerald-900/10"
            src="/brand-shortener.svg"
            alt="Logo Corto&Sencillo"
          />
          <h1 className="text-4xl font-extrabold tracking-normal text-slate-950 md:text-5xl">Corto&Sencillo</h1>
          <p className="mx-auto max-w-md text-sm font-medium text-slate-600 md:text-base">
            Acorta tus enlaces largos al instante y comparte links limpios respaldados por AWS Lambda y DynamoDB.
          </p>
        </div>

        <div className="animate-rise space-y-6 rounded-lg border border-white/70 bg-white/88 p-6 shadow-xl shadow-slate-900/10 backdrop-blur md:p-8">
          <UrlForm onSubmit={handleShorten} isLoading={loading} />

          {loading && <Loader />}

          {error && (
            <div className="flex items-start space-x-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          {result && <ResultCard data={result} />}
        </div>
      </div>
    </main>
  );
};

export default App;
