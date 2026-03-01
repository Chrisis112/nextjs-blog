'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18nInstance } from '@/i18n'; // твой текущий i18n

// Лоадер пока i18n инициализируется
const ClientContent = dynamic(() => Promise.resolve(({ children, i18nInstance }) => {
  if (!i18nInstance) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}), {
  ssr: false
});

export default function ClientWrapper({ children }) {
  const [i18nInstance, setI18nInstance] = useState(null);

  useEffect(() => {
    async function initI18n() {
      const instance = await getI18nInstance();
      setI18nInstance(instance);
    }
    initI18n();
  }, []);

  return (
    <ClientContent i18nInstance={i18nInstance}>
      {children}
    </ClientContent>
  );
}
