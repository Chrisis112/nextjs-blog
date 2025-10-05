'use client';
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Pusher from "pusher-js";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';




export default function PusherOrderNotifications({ seller }) {
    const { t, i18n } = useTranslation();
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
      });
  }

  useEffect(() => {
    if (!seller) return;
    // Добавить отладку для подключения
    Pusher.logToConsole = true;  // Включить логирование

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    // Слушать события подключения
    pusher.connection.bind('connected', () => {
    });

    pusher.connection.bind('error', (error) => {
    });

    const channel = pusher.subscribe("orders-channel");
    
    channel.bind('pusher:subscription_succeeded', () => {
    });

    channel.bind('pusher:subscription_error', (error) => {
    });

    channel.bind("new-order", (data) => {
      showPersistentSoundToast(data.order);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [seller]);

  return <ToastContainer position="top-right" />;
}
