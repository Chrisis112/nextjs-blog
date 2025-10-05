'use client';
import { CartContext, cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { id } = useParams();  // <-- вызов в верхнем уровне
  const [orderNumber, setOrderNumber] = useState(0);

useEffect(() => {
  if (typeof window.console !== "undefined") {
    if (window.location.href.includes('clear-cart=1')) {
      clearCart();
    }
  }
  if (id) {
    const fetchOrder = async () => {
      setLoadingOrder(true);
      try {
        const res = await fetch('/api/orders?_id=' + id);
        if (!res.ok) throw new Error('Failed to fetch order');
        const orderData = await res.json();
        setOrder(orderData);
        setOrderNumber(orderData.orderNumber);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchOrder();
  }
}, [id]); // удалён clearCart


  const subtotal = order?.cartProducts?.reduce((acc, product) => acc + cartProductPrice(product), 0) || 0;

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Your order" />
        <div className="mt-4 mb-8">
          <p>Thanks for your order!</p>
          <p>We will call you when your order is ready.</p>
          <p>You can pick up your order at Mündi 3 NaiChai Bubble Tea Bar.</p>
        </div>
      </div>
      {loadingOrder && (
        <div>Loading order...</div>
      )}
      {order && (
        <div className="grid md:gap-16">
          <div>
            <p>Your Order Number: {order.orderNumber}</p>
            {order?.cartProducts?.length > 0 && order.cartProducts.map(product => (
              <CartProduct key={product._id} product={product} />
            ))}
            <div className="text-right py-2 text-gray-500">
              Total:
              <span className="text-black font-bold inline-block w-8">€{subtotal}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
