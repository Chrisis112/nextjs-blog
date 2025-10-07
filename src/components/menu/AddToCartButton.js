import { useTranslation } from 'react-i18next';

export default function AddToCartButton({ hasSizesOrExtras, onClick, basePrice, image }) {
  const { t } = useTranslation();

  // Единый стиль кнопки для всех случаев
  const buttonStyle = "w-full bg-primary hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200";

  if (!hasSizesOrExtras) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={buttonStyle}
      >
        {t('addToCart.withoutOptions', { price: basePrice }) || `Add to cart €${basePrice}`}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonStyle}
    >
      {t('addToCart.fromPrice', { price: basePrice }) || `Add to cart (from €${basePrice})`}
    </button>
  );
}
