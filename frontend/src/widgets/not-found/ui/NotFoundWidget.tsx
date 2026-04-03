import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

export function NotFoundWidget() {
  const { t } = useTranslation('common', { keyPrefix: 'notFound' });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-sm max-md:px-4">
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
        {t('title')}
      </h1>
      <div className="h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
      <p className="md:text-xl text-gray-400 max-w-lg text-center">{t('description')}</p>
      <Link
        to="/"
        className="group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all"
      >
        {t('button')}
        <svg
          className="group-hover:translate-x-0.5 transition"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417"
            stroke="#1E1E1E"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
