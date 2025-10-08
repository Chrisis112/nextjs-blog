'use client';
import { useProfile } from "@/components/UseProfile";
import PusherOrderNotifications from "@/components/notificationPushers/PusherOrderNotifications";
import FirebaseNotifications from "@/components/notificationPushers/FirebaseNotifications";
import { useEffect } from "react";

export default function ClientSideComponents() {
  const { loading, data: profile } = useProfile();

  // Регистрация сервис-воркера для Firebase push notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  return (
    <>
<PusherOrderNotifications seller={profile} />
      <FirebaseNotifications userSeller={profile} />
    </>
  );
}
