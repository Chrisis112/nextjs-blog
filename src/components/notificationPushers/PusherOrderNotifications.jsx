'use client';
import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import Pusher from "pusher-js";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '../../../firebaseConfig';

export default function PusherOrderNotifications({ seller }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [shownOrderIds, setShownOrderIds] = useState(new Set());

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[i18n.language] || field['ru'] || '');
  };

  function showPersistentSoundToast(order) {
    let audio = new Audio('/mixkit-bell-notification-933.wav');
    audio.loop = true;
    audio.play().catch(() => {
      console.log("Audio play prevented by browser autoplay policy");
    });

    toast(
      ({ closeToast }) => (
        <div>
          <div>{t('pusherNotifications.newOrder')} <b>{order.cartProducts.map(p => getLocalizedText(p.name)).join(', ')}</b></div>
          <div style={{ marginTop: 12 }}>
            <button
              className="bg-green-600 text-white px-2 py-1 rounded"
              onClick={() => {
                audio.pause();
                audio.currentTime = 0;
                closeToast();
                router.push(`/orders/${order._id}`);
              }}
            >
              {t('pusherNotifications.accept')}
            </button>
          </div>
        </div>
      ), {
      autoClose: false,
      position: 'top-right',
      closeOnClick: false,
      onClose: () => {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    );
  }

  const showNotificationOnce = useCallback((order) => {
    if (!order?._id) return;
    if (shownOrderIds.has(order._id)) return;

    // Убираем проверку локации, если нужно показывать просто все уведомления с бекенда
  setShownOrderIds(prev => {
    if (prev.has(order._id)) {
      return prev; // Уже показано, не показываем опять
    }
    showPersistentSoundToast(order);
    const newSet = new Set(prev);
    newSet.add(order._id);
    return newSet;
  });
}, []);

  useEffect(() => {
  if (!seller || !seller.email || !seller.seller) {
    console.log("No valid seller data or email, skipping setup");
    return;
  }

    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    pusher.connection.bind('connected', () => {
      console.log("Pusher connected");
    });

    const channelName = `orders-channel-${seller.email}`;
    console.log("Subscribing to channel:", channelName);
    const channel = pusher.subscribe(channelName);

    channel.bind("order-paid", (data) => {
      console.log("Pusher event received:", data);
      showNotificationOnce(data.order);
    });

    const messaging = getMessaging(firebaseApp);
    const unsubscribeFirebase = onMessage(messaging, (payload) => {
      console.log('Firebase message received: ', payload);

      let payloadLocations;
      if (Array.isArray(payload.data?.location)) {
        payloadLocations = payload.data.location;
      } else if (typeof payload.data?.location === 'string') {
        try {
          payloadLocations = JSON.parse(payload.data.location);
        } catch {
          payloadLocations = [payload.data.location];
        }
      } else {
        payloadLocations = [];
      }

      const firebaseOrder = {
        _id: payload.data?.orderId || `firebase-${Date.now()}`,
        cartProducts: [{ name: payload.notification?.title || 'Новый заказ' }],
        location: payloadLocations,
      };

      showNotificationOnce(firebaseOrder);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      unsubscribeFirebase();
    };
  }, [seller?.email, showNotificationOnce]);

  return <ToastContainer position="top-right" />;
}
