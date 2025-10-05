'use client';

import { useState, useEffect } from 'react';
import { messaging, getToken } from '../../../firebaseConfig';
import { useTranslation } from 'react-i18next';

export default function FirebaseNotifications({ userSeller }) {
  const { t } = useTranslation();

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

  async function requestPermissionAndSubscribe() {
    if (!messaging) {
      console.warn('Firebase messaging не инициализирован');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        console.log('FCM Token:', token);
        // TODO: отправить token на сервер для сохранения
        setPermissionRequested(true);
        setShowPrompt(false);
      } else {
        console.warn('Пользователь отказал в уведомлениях');
        setPermissionRequested(true);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Ошибка получения разрешения', error);
      setPermissionRequested(true);
      setShowPrompt(false);
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
          background: #1e40af;
          color: white;
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
