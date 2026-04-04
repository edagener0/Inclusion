import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

export function NotFoundWidget() {
  const { t } = useTranslation('common', { keyPrefix: 'notFound' });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-sm max-md:px-4">
      <h1 className="bg-linear-to-r from-white to-gray-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
        {t('title')}
      </h1>
      <div className="my-5 h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 md:my-7"></div>
      <p className="max-w-lg text-center text-gray-400 md:text-xl">{t('description')}</p>
      <Link
        to="/"
        className="group mt-10 flex items-center gap-1 rounded-full bg-white px-7 py-2.5 font-medium text-gray-800 transition-all hover:bg-gray-200 active:scale-95"
      >
        {t('button')}
        <svg
          className="transition group-hover:translate-x-0.5"
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
