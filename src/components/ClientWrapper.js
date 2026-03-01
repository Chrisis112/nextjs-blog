'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18nInstance } from '@/i18n';

// Лоадер пока i18n + Google Maps не готовы
const ClientContent = dynamic(() => Promise.resolve(({ children, i18nInstance, isGoogleMapsLoaded }) => {
  if (!i18nInstance || !isGoogleMapsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mr-3"></div>
        <span>Загрузка...</span>
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
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Инициализация i18n
  useEffect(() => {
    async function initI18n() {
      try {
        const instance = await getI18nInstance();
        setI18nInstance(instance);
      } catch (error) {
        console.error('i18n init error:', error);
      }
    }
    initI18n();
  }, []);

  // Загрузка Google Maps API
  useEffect(() => {
    // Проверяем, не загружен ли уже
    if (window.google || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleMapsLoaded(true);
      console.log('✅ Google Maps API загружен!');
    };
    script.onerror = () => {
      console.error('❌ Google Maps API не загрузился');
      setIsGoogleMapsLoaded(true); // Продолжаем без карты
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <ClientContent 
      i18nInstance={i18nInstance} 
      isGoogleMapsLoaded={isGoogleMapsLoaded}
    >
      {children}
    </ClientContent>
  );
}
