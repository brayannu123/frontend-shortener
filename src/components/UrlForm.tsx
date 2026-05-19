import React, { useState } from 'react';
import { ArrowRight, Link } from 'lucide-react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Por favor, ingresa una URL');
      return;
    }

    try {
      new URL(url);
    } catch (_) {
      setError('Por favor, ingresa una URL valida, por ejemplo https://google.com');
      return;
    }

    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url-input" className="mb-2 block text-sm font-semibold text-slate-700">
          Ingresa la URL original
        </label>
        <div className="relative rounded-lg border border-slate-300 bg-white transition-all duration-200 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-600/15">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Link className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            id="url-input"
            disabled={isLoading}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="https://ejemplo.com/tu-ruta-larga"
            className="block w-full rounded-lg border-0 bg-transparent py-4 pl-12 pr-4 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
        </div>
        {error && <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-900/15 transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      >
        <span>Acortar enlace</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
};

export default UrlForm;
