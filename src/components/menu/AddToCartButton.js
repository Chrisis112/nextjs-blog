import { useTranslation } from 'react-i18next';

export default function AddToCartButton({ hasSizesOrExtras, onClick, basePrice, image }) {
  const { t } = useTranslation();

  if (!hasSizesOrExtras) {
    return (
      <div className="mt-3">
        <button
          targetTop={'5%'}
          targetLeft={'95%'}
          src={image}
        >
          <div onClick={onClick}>
            {t('addToCart.withoutOptions', { price: basePrice })}
          </div>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-primary text-white rounded-full px-12 py-1"
    >
      <span>{t('addToCart.fromPrice', { price: basePrice })}</span>
    </button>
  );
}
