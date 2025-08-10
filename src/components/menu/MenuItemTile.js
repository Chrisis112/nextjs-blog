import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";

export default function MenuItemTile({ onAddToCart, ...item }) {
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

  return (
    <div
      className="bg-gray-200 p-4 rounded-lg text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all"
    >
      {/* ФИКСИРОВАННЫЙ контейнер для картинки */}
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
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="180px"
        />
      </div>

      <h4 className="font-semibold text-xl mb-2">{name}</h4>

      <p className="text-gray-500 text-sm line-clamp-3 mb-3">{description}</p>

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

