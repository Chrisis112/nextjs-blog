import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";

export default function MenuItemTile({onAddToCart, ...item}) {
  const {image, description, name, basePrice,
    sizes, extraIngredientPrices, temperature, pricePoints  } = item;
  const hasSizesOrExtras = sizes?.length > 0 || temperature?.length > 0 || extraIngredientPrices?.length > 0;
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        <Image width={90} height={200} src={image} w className="max-h-auto max-h-24 block mx-auto" alt="BUBBLE TEA"/>
      </div>
      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-500 text-sm line-clamp-3">
        {description}
      </p>
      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={onAddToCart}
        basePrice={basePrice}
        PricePoints= {pricePoints}
      />
    </div>
  );
}
