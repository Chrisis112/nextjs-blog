import {CartContext} from "@/components/AppContext";

import {useContext, useState} from "react";
import {useProfile} from "@/components/UseProfile";

export default function Agreement(agreement) {
    const {addToCart} = useContext(CartContext);
    const [showPopup, setShowPopup] = useState(false);

  async function handleAgreement() {
    console.log('Agree');

    if (!showPopup) {
      setShowPopup(true);
      return;
    }
  }
  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => {
        return prev.filter(e => e.name !== extraThing.name);
      });
    }
  }
  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
    <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
          We are all about bringing a taste of China to Estonia through our delicious bubble teas. Our journey began with a love for authentic ingredients and a desire to share the special tastes we discovered during our life in Asia. Our owner spent many years living in China, soaking up the culture and flavors of the authentic Asia.
          </p>
          <p>We are all about exploration here. Mixing and matching flavors, discovering new combinations, it is what keeps us excited and inspired every day. And of course, we only use the original ingredients because we believe in offering the best to our customers.</p>
          <p>So, whether you are craving a classic bubble tea or feeling adventurous and want to try something new, we have got you covered. Come join us on this tasty journey, and lets explore the flavors together, one sip at a time!</p>
        </div>
        </div>
      )}
      
    </>
  );
}