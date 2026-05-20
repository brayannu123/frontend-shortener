import React from 'react';
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';

interface CountdownScreenProps {
  originalUrl: string;
  redirectUrl: string | null;
  secondsLeft: number;
}

const CountdownScreen: React.FC<CountdownScreenProps> = ({ originalUrl, redirectUrl, secondsLeft }) => {
  return (
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
            Preparando redireccion
          </h2>
          <p className="mt-3 text-base font-semibold text-slate-700">
            Te llevaremos al destino final en {secondsLeft} segundos.
          </p>
          <p className="mt-3 break-all text-sm leading-6 text-slate-600">{originalUrl}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={redirectUrl || originalUrl}
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
  );
};

export default CountdownScreen;
