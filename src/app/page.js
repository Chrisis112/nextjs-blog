'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../../firebaseConfig';

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
      if (!session || !session.accessToken) return;

      try {
        const messaging = getMessaging(firebaseApp);
        const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
         const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
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
          <a href="https://maps.app.goo.gl/GQ5jHkTBXVvaJ8Hw5" className="text-2xl text-gray-500">Mündi 3</a>
        </div>
        <div className="max-h-auto max-h-25 block mx-auto flex">
          <iframe
            className="max-h-auto max-h-25 block mx-auto flex"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.721310167819!2d24.742489877931824!3d59.43772247466704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469293f2ddec595f%3A0xd52d81a807bc04df!2sNaiChai%20Bubble%20Tea%20Bar!5e0!3m2!1sru!2see!4v1712001791589!5m2!1sru!2see"
            width="300"
            height="400"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
