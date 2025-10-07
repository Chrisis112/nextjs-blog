import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function MenuItemTile({ onAddToCart, ...item }) {
  const { i18n } = useTranslation();

  const {
    image,
    description,
    name,
    basePrice,
    sizes = [],
    extraIngredientPrices = [],
    temperature = [],
    pricePoints,
    locations
  } = item;

  const hasSizesOrExtras =
    sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;

  const currentLang = i18n.language;

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  let locationsText = "";
  if (locations && (Array.isArray(locations) ? locations.length : locations)) {
    if (Array.isArray(locations)) {
      locationsText = locations.join(", ");
    } else {
      locationsText = locations;
    }
  }

  return (
    <div
      className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all flex flex-col justify-between mx-auto"
      style={{
        width: "100%",
        maxWidth: "300px",
        minHeight: "460px",
        maxHeight: "460px",
        boxSizing: "border-box",
      }}
    >
      {/* Верхний контент */}
      <div className="flex flex-col items-center">
        <div
          className="mx-auto mb-3"
          style={{
            width: "180px",
            height: "180px",
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >
          <Image
            src={image || "/default-image.png"}
            alt={getLocalizedText(name)}
            fill
            style={{ objectFit: "cover" }}
            sizes="180px"
          />
        </div>

        <h4
          className="font-semibold text-xl mb-2 text-center"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            lineHeight: "1.5"
          }}
        >
          {getLocalizedText(name)}
        </h4>

        {locationsText && (
          <div className="text-sm text-gray-600 mb-2 px-2"
            style={{
              minHeight: "20px",
              maxHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {locationsText}
          </div>
        )}

        <p
          className="text-gray-500 text-sm mb-4 px-2"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            lineHeight: "1.3"
          }}
        >
          {getLocalizedText(description)}
        </p>
      </div>

      {/* Кнопка внизу */}
      <div className="mt-auto">
        <AddToCartButton
          image={image}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
          basePrice={basePrice}
          PricePoints={pricePoints}
        />
      </div>
    </div>
  );
}
