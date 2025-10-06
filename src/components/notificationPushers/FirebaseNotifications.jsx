'use client';

import { useState, useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../../../firebaseConfig';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

export default function FirebaseNotifications({ userSeller }) {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  const [permissionRequested, setPermissionRequested] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!userSeller) return;

    if (Notification.permission === 'default') {
      setShowPrompt(true);
      setPermissionRequested(false);
    } else {
      setPermissionRequested(true);
      setShowPrompt(false);
    }
  }, [userSeller]);

  async function sendTokenToServer(token) {
    try {
      if (!session || !session.accessToken) {
        console.warn('No access token in session!');
        return;
      }
      await fetch('/api/save-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ token }),
      });
      console.log('FCM Token sent to server');
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  }

  async function requestPermissionAndSubscribe() {
    if (!firebaseApp) {
      console.warn('Firebase не инициализирован');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionRequested(true);
      setShowPrompt(false);

      if (permission !== 'granted') {
        console.log('Permission not granted for notifications');
        return;
      }

      const messaging = getMessaging(firebaseApp);
              const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        await sendTokenToServer(currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch (err) {
      console.log('An error occurred while retrieving token.', err);
    }
  }

  if (!showPrompt) return null;

  return (
    <>
      <div className="notification-prompt">
        <p>{t('firebaseNotifications.promptMessage')}</p>
        <button onClick={requestPermissionAndSubscribe}>{t('firebaseNotifications.allow')}</button>
      </div>
      <style jsx>{`
        .notification-prompt {
          position: fixed;
          top: 10px;
          left: 10px;
          background: #dde1eeff;
          color: black;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10000;
          animation: fadein 0.3s ease forwards;
        }
        .notification-prompt p {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }
        .notification-prompt button {
          background: #2563eb;
          border: none;
          color: white;
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .notification-prompt button:hover {
          background: #1d4ed8;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </>
  );
}
