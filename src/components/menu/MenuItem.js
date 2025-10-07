import { CartContext } from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/legacy/image";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MenuItem(menuItem) {
  const {
    image, name, description, basePrice,
    sizes = [], extraIngredientPrices = [], temperature = [], pricePoints = 0,
    locations = [],
  } = menuItem;

  const { addToCart } = useContext(CartContext);
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'ru';

  // Инициализация selectedLocation: если есть выбранная из пропсов - используем её,
  // иначе первая из массива locations
  const [selectedLocation, setSelectedLocation] = useState(
    menuItem.selectedLocation || (locations.length > 0 ? locations[0] : '')
  );

  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedTemperature, setSelectedTemperature] = useState(temperature?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Универсальная функция для локализации текста
  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string' ? field : (field[currentLang] || field['ru'] || '');
  };

  const menuItemTitle = getLocalizedText(name);

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0 || (locations && locations.length > 0);
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(
      { ...menuItem, selectedLocation }, // передаем выбранную локацию
      selectedSize, selectedExtras, selectedTemperature
    );
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
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            style={{
              width: "94vw",
              maxWidth: 320,
              minHeight: 100,
              maxHeight: "65vh",
              overflowY: "auto",
              borderRadius: "18px",
              boxShadow: "0 4px 32px 4px rgba(28,28,28,0.18)",
            }}
            onClick={ev => ev.stopPropagation()}
            className="bg-white p-4 max-w-xs w-full"
          >
            <div className="items-center flex flex-col">
              <div style={{
                width: "160px",
                height: "160px",
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

              {/* Выбор локации */}
              {locations?.length > 0 && (
                <div className="mb-3 w-full">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    {t('menuItem.pickLocation') || "Локация"}
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    {locations.map(loc => (
                      <option value={loc} key={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Остальной интерфейс опций (размер, температура, допы) */}
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
                className="primary w-full mt-3 bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
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

      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem}
        image={image}
        title={menuItemTitle}
      />
    </>
  );
}
