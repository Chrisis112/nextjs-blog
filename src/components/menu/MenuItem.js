'use client';
import { CartContext } from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/legacy/image";
import { useContext, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import { useTranslation } from "react-i18next";

export default function MenuItem(menuItem) {
  const {
    image, name, description, basePrice,
    sizes = [], extraIngredientPrices = [], temperature = [], pricePoints = 0
  } = menuItem;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedTemperature, setSelectedTemperature] = useState(temperature?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { data: profileData } = useProfile();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'ru';

  // Универсальная функция для вывода текста с учётом типа
  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras, selectedTemperature);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPopup(false);
  }

  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => prev.filter(e => e._id !== extraThing._id));
    }
  }

  // Цены
  let selectedPrice = basePrice;
  let selectedPoints = pricePoints;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
    selectedPoints += selectedSize.price;
  }
  if (selectedTemperature) {
    selectedPrice += selectedTemperature.price;
    selectedPoints += selectedTemperature.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
      selectedPoints += extra.price;
    }
  }
  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div
            style={{ width: 220, minHeight: 400 }}
            onClick={ev => ev.stopPropagation()}
            className="bg-white p-4 rounded-lg max-w-md shadow-lg"
          >
            <div className="items-center flex flex-col">
              {/* Единый контейнер для изображения */}
              <div style={{
                width: 220,
                height: 300,
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "12px"
              }}>
                <Image
                  src={image || "/default-image.png"}
                  alt={getLocalizedText(name)}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h2 className="text-lg font-bold text-center mb-2">{getLocalizedText(name)}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">{getLocalizedText(description)}</p>

              {sizes?.length > 0 && (
                <div className="py-2 w-full">
                  <h3 className="text-center text-gray-700 mb-1">{t('menuItem.pickSize')}</h3>
                  {sizes.map(size => (
                    <label
                      key={size._id}
                      className={`flex items-center gap-2 p-2 border rounded-md mb-1 cursor-pointer ${selectedSize?.name === size.name ? 'border-indigo-600 font-semibold' : ''}`}
                    >
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"
                      />
                      {size.name} €{basePrice + size.price}
                    </label>
                  ))}
                </div>
              )}

              {temperature?.length > 0 && (
                <div className="py-2 w-full">
                  <h3 className="text-center text-gray-700 mb-1">{t('menuItem.selectTemperature')}</h3>
                  {temperature.map(temp => (
                    <label
                      key={temp._id}
                      className={`flex items-center gap-2 p-2 border rounded-md mb-1 cursor-pointer ${selectedTemperature?.name === temp.name ? 'border-indigo-600 font-semibold' : ''}`}
                    >
                      <input
                        type="radio"
                        onChange={() => setSelectedTemperature(temp)}
                        checked={selectedTemperature?.name === temp.name}
                        name="temperature"
                      />
                      {temp.name} {temp.price > 0 ? `+€${temp.price}` : ""}
                    </label>
                  ))}
                </div>
              )}

              {extraIngredientPrices?.length > 0 && (
                <div className="py-2 w-full">
                  <h3 className="text-center text-gray-700 mb-1">{t('menuItem.anyExtras')}</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing._id}
                      className={`flex items-center gap-2 p-2 border rounded-md mb-1 cursor-pointer ${selectedExtras.map(e => e._id).includes(extraThing._id) ? 'border-indigo-600' : ''}`}
                    >
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                        name={extraThing.name}
                      />
                      {extraThing.name} +€{extraThing.price}
                    </label>
                  ))}
                </div>
              )}
              <button
                className="primary w-full sticky bottom-2 mt-3 bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
                onClick={handleAddToCartButtonClick}
              >
                {t('menuItem.addToCartPrice', { price: selectedPrice })}
              </button>
              <button
                className="mt-2 w-full py-2 text-gray-700 rounded border hover:bg-gray-200"
                onClick={() => setShowPopup(false)}
              >
                {t('menuItem.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Тайл компонента — тоже под контролем! */}
      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem}
        image={image}
      />
    </>
  );
}
