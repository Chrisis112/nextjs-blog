import ChevronDown from "@/components/icons/ChevronDown";
import ChevronUp from "@/components/icons/ChevronUp";
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default function MenuItemPriceProps({ name, addLabel, props, setProps }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps(oldProps => [...oldProps, { name: '', price: 0 }]);
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps(prevProps => {
      const newProps = [...prevProps];
      newProps[index][prop] = newValue;
      return newProps;
    });
  }

  function removeProp(indexToRemove) {
    setProps(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button"
      >
        {isOpen ? <ChevronUp /> : <ChevronDown />}
        <span>{name}</span>
        <span>({props?.length})</span>
      </button>

      <div className={isOpen ? 'block' : 'hidden'}>
        {props?.length > 0 && props.map((size, index) => (
          <div key={index} className="flex items-end gap-2">
            <div>
              <label>{t('menuItemPrice.nameLabel')}</label>
              <input
                type="text"
                placeholder={t('menuItemPrice.sizePlaceholder')}
                value={size.name}
                onChange={ev => editProp(ev, index, 'name')}
              />
            </div>

            <div>
              <label>{t('menuItemPrice.priceLabel')}</label>
              <input
                type="text"
                placeholder={t('menuItemPrice.pricePlaceholder')}
                value={size.price}
                onChange={ev => editProp(ev, index, 'price')}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => removeProp(index)}
                className="bg-white mb-2 px-2"
                aria-label={t('menuItemPrice.removeLabel')}
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addProp}
          className="bg-white items-center flex gap-2 p-2 mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>{addLabel || t('menuItemPrice.addLabel')}</span>
        </button>
      </div>
    </div>
  );
}
