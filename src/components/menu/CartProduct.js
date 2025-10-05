import { cartProductPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CartProduct({ product, onRemove }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ru';

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string' ? field : (field[currentLang] || field['ru'] || '');
  };

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image width={240} height={240} src={product.image} alt={getLocalizedText(product.name)} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">{getLocalizedText(product.name)}</h3>
        {product.size && (
          <div className="text-sm">
            {t('cartProduct.size')} <span>{getLocalizedText(product.size.name)}</span>
          </div>
        )}
        {product.temperature && (
          <div className="text-sm">
            {t('cartProduct.temperature')} <span>{getLocalizedText(product.temperature.name)}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map(extra => (
              <div key={getLocalizedText(extra.name)}>
                {getLocalizedText(extra.name)} €{extra.price}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold">
        €{cartProductPrice(product)}
      </div>
    </div>
  );
}
