'use client';

import { CartContext, cartProductPrice, cartProductPrice2 } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useProfile } from "@/components/UseProfile";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Trash from "@/components/icons/Trash";
import Image from "next/image";
import { useTranslation } from "react-i18next";


export default function CartPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ru';
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();

    const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error(t('cartPage.paymentFailed'));
      }
    }
  }, [t]);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        postalCode,
        country
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

  let subtotal = 0;
  let subtotal2 = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
    subtotal2 += cartProductPrice2(p);
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartProducts
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          const data = await response.json();
window.location.href = data.url;

        } else {
          reject();
        }
      });
    });
    await toast.promise(promise, {
      loading: t('cartPage.preparingOrder'),
      success: t('cartPage.redirectingPayment'),
      error: t('cartPage.errorOccurred'),
    });
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader={t('cartPage.cart')} />
        <p className="mt-4">{t('cartPage.cartEmpty')}</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader={t('cartPage.cart')} />
      </div>
      <div className="mt-8 grid grid-cols-1">
        <div>
          {cartProducts?.length === 0 && (
            <div>{t('cartPage.noProducts')}</div>
          )}
       {cartProducts?.length > 0 && cartProducts.map((product, index) => (
  <div key={product.image + index} className="flex items-center gap-4 border-b py-4">
    <div className="w-24">
      <Image width={240} height={240} src={product.image} alt={product.name} />
    </div>
    <div className="grow">
      <h3 className="font-semibold">{getLocalizedText(product.name)}</h3>

      {/* Локация заказа */}
      {product.location && (
        <div className="text-sm">
          {t('menuItem.location2')}: <span>{getLocalizedText(product.location)}</span>
        </div>
      )}

      {product.size && (
        <div className="text-sm">
          {t('cartPage.size')}: <span>{getLocalizedText(product.size.name)}</span>
        </div>
      )}

      {product.temperature && (
        <div className="text-sm">
          {t('cartPage.temperature')}: <span>{getLocalizedText(product.temperature.name)}</span>
        </div>
      )}

      {product.extras?.length > 0 && (
        <div className="text-sm text-gray-500">
          {product.extras.map(extra => (
            <div key={getLocalizedText(extra.name)}>
              {getLocalizedText(extra.name)} €{extra.price}
            </div>
          ))}
        </div>
      )}

    </div>
    <div className="text-lg font-semibold">
      €{cartProductPrice(product)}
      {profileData?.city && (
        <div>
          {t('cartPage.forPoints')}: {cartProductPrice2(product)}
        </div>
      )}
    </div>
    <div className="ml-2">
      <button
        type="button"
        onClick={() => removeCartProduct(index)}
        className="p-2"
        aria-label={t('cartPage.removeProduct')}
      >
        <Trash />
      </button>
    </div>
  </div>
))}

          <div className="flex justify-end items-center mt-4 gap-2">
            <div className="text-gray-500">{t('cartPage.total')}:</div>
            <div className="font-semibold text-right">€{subtotal}<br /></div>
          </div>
          <div>
            <br />
            <form onSubmit={proceedToCheckout}>
              <button type="submit">{t('cartPage.pay', { price: subtotal })}</button>
            </form>
            {profileData?.city && (
              <form className="mt-4" onSubmit={proceedToCheckout}>
                <button type="submit">{t('cartPage.payWithPoints', { points: subtotal2 })}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
