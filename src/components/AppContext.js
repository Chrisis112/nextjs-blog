'use client';
import {SessionProvider} from "next-auth/react";
import {createContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  
  if (cartProduct.size) {
    price += cartProduct.size.price;

  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
    if (cartProduct.temperature?.length > 0) {
      for (const temperature of cartProduct.temperature) {
        price += temperature.price;
      }
  }
}
  
  return price; 
}
export function cartProductPrice2(cartProduct) {
  let p2 = cartProduct.pricePoints
  if (cartProduct.size) {
    p2 += cartProduct.size.price;

  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      p2 += extra.price;
    }
    if (cartProduct.temperature?.length > 0) {
      for (const temperature of cartProduct.temperature) {
        p2 += temperature.price;
      }
  }
}
  
  return p2; 
}

export function AppProvider({children}) {
  const [cartProducts,setCartProducts] = useState([]);

  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts( JSON.parse( ls.getItem('cart') ) );
    }
  },[]);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

   function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts
        .filter((v,index) => index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Product removed');
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, size=null, extras=[], temperature=[]) {
    setCartProducts(prevProducts => {
      const cartProduct = {...product, size, temperature, extras};
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}