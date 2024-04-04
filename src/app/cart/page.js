'use client';
import {CartContext, cartProductPrice, cartProductPrice2} from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import {useProfile} from "@/components/UseProfile";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import Trash from "@/components/icons/Trash"
import Image from "next/image";;
export default function CartPage() {



  const {cartProducts,removeCartProduct} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const {data:profileData} = useProfile();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const {phone, streetAddress, city, postalCode, country} = profileData;
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
  let subtotal2= 0
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
    subtotal2 += cartProductPrice2(p);
  }
  async function proceedToCheckout(ev) {
    ev.preventDefault();
    // address and shopping cart products
    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          cartProducts
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });
    await toast.promise(promise, {
      loading: 'Preparing your order...',
      success: 'Redirecting to payment...',
      error: 'Something went wrong... Please try again later',
    })
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </section>
    );
  }
  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid grid-cols-1">
        <div>
          {cartProducts?.length === 0 && (
            <div>No products in your shopping cart</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product, index) => (
            <div key={product.image} className="flex items-center gap-4 border-b py-4">
            <div className="w-24">
              <Image width={240} height={240} src={product.image} alt={''} />
            </div>
            <div className="grow">
              <h3 className="font-semibold">
                {product.name}
              </h3>
              {product.size && (
                <div className="text-sm">
                  Size: <span>{product.size.name}</span>
                </div>
              )}
               {product.temperature && (
                <div className="text-sm">
                  Temperature: <span>{product.temperature.name}</span>
                </div>
              )}
              {product.extras?.length > 0 && (
                <div className="text-sm text-gray-500">
                  {product.extras.map(extra => (
                    <div key={extra.name}>{extra.name} €{extra.price}</div>
                    
                  ))}
                  
                </div>
              )}
            </div>
            <div onClick={()=>onHandleTag('react')}  className="text-lg font-semibold">
            €{cartProductPrice(product)}
            {profileData.city&& (
          <div>
            For points:{cartProductPrice2(product)}
          </div>
          
        )}
            </div>
            {  (
              <div className="ml-2">
                <button
                  type="button"
                  onClick={() => removeCartProduct(index)}
                  className="p-2">
                  <Trash />
                </button>
                
              </div>
            )}
          </div>
           
            
          ), <div> <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2">
            <Trash />
          </button></div>)}
          <div className=" flex justify-end items-center">
            <div className="text-gray-500">
              Total:
            
            </div>
            <div className="font-semibold pl-2 text-right">
              €{subtotal}<br />
            </div>
            
          </div>
          <div >
            <br/>
          <form onSubmit={proceedToCheckout}>
            <button  type="submit">Pay €{subtotal}</button>
          </form>
          {profileData.city&& (
          <form className="mt-4" onSubmit={proceedToCheckout}>
          <button  type="submit">Pay with points {subtotal2}</button>
        </form>
        )}
        
        </div>
        </div>
        
      </div>
    </section>
  );
}
