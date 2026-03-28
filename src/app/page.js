'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../../firebaseConfig';
import GoogleMap from '@/components/GoogleMap';
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TrendingSlider from "@/components/TrendingSlider";
import Hero2 from "@/components/layout/Hero2";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function sendFcmToken() {
if (!session?.accessToken || session.accessToken.length < 20) {
  console.warn('Нет валидного accessToken, ждём авторизации');
  return; // Не отправляем, пока пользователь не авторизован
}
      try {
        const messaging = getMessaging(firebaseApp);
        const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
         const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          console.log('Session:', session);
console.log('accessToken перед отправкой:', session?.accessToken);
          await fetch('/api/save-fcm-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ token }),
          });
        }
      } catch (error) {
        console.error('Failed to update FCM token from Home:', error);
      }
    }

    if (status === 'authenticated') {
      sendFcmToken();
    }
  }, [status, session]);

  return (
    <>
      <SpeedInsights/>
      <Hero2/>
      <div className="w-full flex flex-col sm:flex-row justify-center mb-12 items-center gap-4 px-2">
        <div style={{ width: "300px", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            alt={t('imageAlt')}
            width={350}
            height={600}
            priority
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom", borderRadius: "16px" }}
            src="https://i.imgur.com/DL8lA2O.png"
          />
        </div>
        <div style={{ width: "280px", height: "280px", overflow: "hidden", borderRadius: "16px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            alt={t('imageAlt2')}
            width={350}
            height={600}
            priority
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom", borderRadius: "16px" }}
            src="/4.png"
          />
        </div>
      </div>
      <TrendingSlider/>
      <Hero />
      <HomeMenu /> 
      <section className="text-center mt-10" id="about">
        <SectionHeaders subHeader={t('about.subHeader')} mainHeader={t('about.mainHeader')} />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>{t('about.paragraph1')}</p>
         <p>{t('about.paragraph2')}</p>
          <p>{t('about.paragraph3')}</p>
        </div>
        <br/>
      </section>

      <section className="text-center my-8" id="contact">
        <SectionHeaders mainHeader={t('contact.mainHeader')}/>
        <div className="mt-2 text-2xl text-gray-500">{t('contact.companyName')}</div>
        <div className="mt-2 text-2xl text-gray-500">{t('contact.vat')}</div>
        <div className="mt-4">
          <a href="tel:+37256650230" className="text-2xl underline text-gray-500">+372 5665 0230</a>
          <div className="mt-2">
            <a href="mailto:info@naichai.ee" className="text-2xl underline text-gray-500">info@naichai.ee</a>
          </div>
        </div>
        <div className="mt-2">
          <a href="https://maps.app.goo.gl/GQ5jHkTBXVvaJ8Hw5" className="text-2xl text-gray-500">Avatud: Suur-Karja tn 11</a>
        </div>
  <div className="mt-8 max-w-md mx-auto">
{/*<GoogleMap 
  lat={59.4355418} 
  lng={24.7465335} 
  zoom={17}
/>
*/}
  </div>
      </section>
    </>
  );
}
