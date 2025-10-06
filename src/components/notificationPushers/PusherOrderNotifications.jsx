'use client';
import { useEffect } from "react";
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

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string' 
      ? field 
      : (field[i18n.language] || field['ru'] || '');
  };

  function showPersistentSoundToast(order) {
    let audio = new Audio('/mixkit-bell-notification-933.wav');
    audio.loop = true;
    audio.play();

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

  useEffect(() => {
    if (!seller) return;
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    pusher.connection.bind('connected', () => {});

    pusher.connection.bind('error', (error) => {});

    const channel = pusher.subscribe("orders-channel");
    
    channel.bind('pusher:subscription_succeeded', () => {});

    channel.bind('pusher:subscription_error', (error) => {});

    channel.bind("order-paid", (data) => {
      showPersistentSoundToast(data.order);
    });

    // Firebase Messaging subscription for push notifications in foreground
    const messaging = getMessaging(firebaseApp);
    const unsubscribeFirebase = onMessage(messaging, (payload) => {
      console.log('Firebase message received: ', payload);
      showPersistentSoundToast({
        _id: payload.data?.orderId || 'firebase',
        cartProducts: [{ name: payload.notification?.title || 'Новый заказ' }]
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      unsubscribeFirebase();
    };
  }, [seller, router]);

  return <ToastContainer position="top-right" />;
}
