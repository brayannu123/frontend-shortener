import React, { useState } from 'react';
import { Check, Clipboard, ExternalLink } from 'lucide-react';
import { ShortenResponse } from '../services/api';

interface ResultCardProps {
  data: ShortenResponse;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div className="animate-rise space-y-6 rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-200 pb-4">
        <h3 className="text-lg font-bold text-emerald-950">Enlace acortado</h3>
        <span className="rounded-md border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800">
          ID: {data.shortId}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Link corto</label>
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-200 bg-white p-2 pl-3">
            <span className="flex-1 select-all break-all text-sm font-medium text-emerald-800">{data.shortUrl}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center space-x-1.5 rounded-md p-2.5 text-xs font-semibold transition-all duration-200 ${
                copied
                  ? 'border border-emerald-300 bg-emerald-100 text-emerald-800'
                  : 'border border-sky-700 bg-sky-700 text-white hover:bg-sky-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Clipboard className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">URL original</label>
          <div className="flex items-center justify-between space-x-2 rounded-lg border border-emerald-100 bg-white p-3">
            <span className="line-clamp-2 max-w-[85%] break-all text-xs text-slate-600">{data.originalUrl}</span>
            <a
              href={data.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-orange-500 bg-orange-500 p-1.5 text-white transition-all duration-200 hover:bg-orange-600"
              title="Abrir URL original"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
