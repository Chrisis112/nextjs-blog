'use client';

import { AppProvider } from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Comfortaa } from 'next/font/google';
import './globals.css';
import { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18nInstance } from '../i18n';

import Link from "next/link";
import ClientSideComponents from "@/components/notificationPushers/ClientSideComponents";

const roboto = Comfortaa({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function RootLayout({ children }) {
  const [i18nInstance, setI18nInstance] = useState(null);

  useEffect(() => {
    async function init() {
      const instance = await getI18nInstance();
      setI18nInstance(instance ?? null);
    }
    init();
  }, []);

  // Показываем что-то (null или лоадер), пока i18n не инициализирован
  if (!i18nInstance) {
    return null;
  }

  return (
    <html lang={i18nInstance.language || 'en'}>
      <body className={roboto.className}>
        <I18nextProvider i18n={i18nInstance}>
          <main className="max-w-4xl mx-auto p-2 pt-20 min-h-screen flex flex-col gap-2">
            <AppProvider>
              <Toaster />
              <Header />
              <ClientSideComponents />
              {children}
              <footer className="border-t p-8 text-center text-gray-500 mt-16">
                &copy; 2025 All rights reserved
                <div>
                  <Link className="underline" href={'/terms'}>Kasutustingimused</Link>
                  <div id="Privacy">
                    <Link className="underline" href={'/terms/#privacy'}>Privaatsuspoliitika</Link>
                  </div>
                </div>
              </footer>
            </AppProvider>
          </main>
        </I18nextProvider>
      </body>
    </html>
  );
}
