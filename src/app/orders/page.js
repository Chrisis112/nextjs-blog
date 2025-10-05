'use client';

import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import {dbTimeForHuman} from "@/libs/datetime";
import Link from "next/link";
import {useEffect, useState, useRef} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';


export default function OrdersPage() {
      const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const {loading, data: profile} = useProfile();
  const previousPaidOrderIds = useRef(new Set()); // Для отслеживания предыдущих оплаченных заказов

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders').then(res => {
      res.json().then(ordersData => {
        ordersData;
        setOrders(ordersData);
        setLoadingOrders(false);

        const currentPaidOrderIds = new Set(ordersData.filter(o => o.paid).map(o => o._id));

        const newPaidOrders = ordersData.filter(
          o => o.paid && !previousPaidOrderIds.current.has(o._id)
        );

        if (profile?.seller && newPaidOrders.length > 0) {
          newPaidOrders.forEach(order => {
            showPersistentSoundToast(order);
          });
        }
        previousPaidOrderIds.current = currentPaidOrderIds;
      });
    });
  }

  const getLocalizedText = (field, currentLang = 'ru') => {
  if (!field) return '';
  return typeof field === 'string' 
    ? field 
    : (field[currentLang] || field['ru'] || '');
};

  // Toast + loop sound функция для показа
  function showPersistentSoundToast(order) {
    let audio = new Audio('/mixkit-bell-notification-933.wav');
    audio.loop = true;
    audio.play();

    toast(
      ({ closeToast }) => (
        <div>
          <div>Новый заказ: <b>  {order.cartProducts.map(p => getLocalizedText(p.name, i18n.language)).join(', ')}</b></div>
          <div style={{ marginTop: 12 }}>
            <button
              className="bg-green-600 text-white px-2 py-1 rounded"
              onClick={() => {
                audio.pause();
                audio.currentTime = 0;
                closeToast();
              }}
            >
              Принять
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

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <button
        onClick={() => showPersistentSoundToast({
          _id: 'test-order',
          cartProducts: [{ name: 'Тестовая позиция' }]
        })}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Тестировать toast с loop-звуком
      </button>

      <UserTabs isSeller={true} isAdmin={profile?.admin} />

      <div className="mt-8">
        {loadingOrders && (
          <div>Loading orders...</div>
        )}
        {orders?.length > 0 && orders.map(order => (
          <div
            key={order._id}
            className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
          >
            <div className="grow flex flex-col md:flex-row items-center gap-6">
              <div>
                <div className={
                  (order.paid ? 'bg-green-500' : 'bg-red-400') +
                  ' p-2 rounded-md text-white w-24 text-center'
                }>
                  {order.paid ? 'Paid' : 'Not paid'}
                </div>
                <p>Order Number: {order.orderNumber}</p>
              </div>
              <div className="grow">
                <div className="flex gap-2 items-center mb-1">
                  <div className="grow">{order.userEmail}</div>
                  <div className="text-gray-500 text-sm">{dbTimeForHuman(order.createdAt + 3)}</div>
                </div>
<div className="text-gray-500 text-xs">
  {order.cartProducts.map(p => getLocalizedText(p.name, i18n.language)).join(', ')}
</div>
              </div>
            </div>
            <div className="justify-end flex gap-2 items-center whitespace-nowrap">
              <Link href={"/orders/" + order._id} className="button">
                Show order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
