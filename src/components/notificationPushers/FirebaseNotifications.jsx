'use client';

import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseApp from '../../../firebaseConfig';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

export default function FirebaseNotifications({ userSeller }) {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [permissionRequested, setPermissionRequested] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [messaging, setMessaging] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && firebaseApp) {
      try {
        const messagingInstance = getMessaging(firebaseApp);
        setMessaging(messagingInstance);
      } catch (error) {
        console.error('Error initializing messaging:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userSeller) return;

    if (Notification.permission === 'default') {
      setShowPrompt(true);
      setPermissionRequested(false);
    } else if (Notification.permission === 'granted' && messaging) {
      setPermissionRequested(true);
      setShowPrompt(false);
      initializeToken();
    }
  }, [userSeller, messaging]);

  // Подписка на foreground сообщения - НЕ показываем уведомления вручную чтобы не дублировать
  useEffect(() => {
    if (!messaging || !userSeller) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      // Здесь можно добавить кастомные UI уведомления (toast и т.п.), но системные пуши показывает SW
    });
    return () => unsubscribe();
  }, [messaging, userSeller]);

  async function initializeToken() {
    if (!messaging) return;

    try {
      const currentToken = await getToken(messaging, { 
        vapidKey: 'BO15x114yYqftFyLlDcR6R3aHMVVuCup1MUlAsSq_TOQWi5sK-C7bwpYwCd840n2vG-qWOWJYhhPRrdmU6aknFc'
      });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        await sendTokenToServer(currentToken);
      } else {
        console.log('No registration token available.');
      }
    } catch (err) {
      console.log('Error retrieving token:', err);
    }
  }

  async function sendTokenToServer(token) {
    if (!session || !session.accessToken) return;

    try {
      const res = await fetch('/api/save-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        console.log('Token sent successfully');
      } else {
        console.error('Failed to send token:', await res.text());
      }
    } catch (error) {
      console.error('Error sending token:', error);
    }
  }

  async function requestPermissionAndSubscribe() {
    if (!firebaseApp) return;

    const permission = await Notification.requestPermission();
    setPermissionRequested(true);
    setShowPrompt(false);

    if (permission === 'granted') {
      await initializeToken();
    } else {
      console.log('Notification permission not granted');
    }
  }

  if (!showPrompt) return null;

  return (
    <>
      <div className="notification-prompt">
        <p>{t('firebaseNotifications.promptMessage')}</p>
        <button onClick={requestPermissionAndSubscribe}>
          {t('firebaseNotifications.allow')}
        </button>
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
