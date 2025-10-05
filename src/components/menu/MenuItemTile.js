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
    pricePoints
  } = item;

  const hasSizesOrExtras =
    sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;

  const currentLang = i18n.language;

  // Универсальная функция для вывода текста с учётом типа
  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  return (
    <div
      className="bg-gray-200 p-4 rounded-lg text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all"
    >
      <div
        className="mx-auto mb-3"
        style={{
          width: "180px",     // ширина карточки
          height: "180px",    // высота карточки
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

      <h4 className="font-semibold text-xl mb-2">
        {getLocalizedText(name)}
      </h4>

      <p className="text-gray-500 text-sm line-clamp-3 mb-3">
        {getLocalizedText(description)}
      </p>

      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={onAddToCart}
        basePrice={basePrice}
        PricePoints={pricePoints}
      />
    </div>
  );
}
