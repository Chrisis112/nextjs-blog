import { CartContext } from "@/components/AppContext";
import { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function Agreement() {
  const { addToCart } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();

  async function handleAgreement() {
    console.log('Agree');
    if (!showPopup) {
      setShowPopup(true);
      return;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
        >
          <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
            <p>{t('agreement.paragraph1')}</p>
            <p>{t('agreement.paragraph2')}</p>
            <p>{t('agreement.paragraph3')}</p>
          </div>
        </div>
      )}
    </>
  );
}
