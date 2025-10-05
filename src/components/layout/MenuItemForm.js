import { useEffect, useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import { useTranslation } from 'react-i18next';

export default function MenuItemForm({ onSubmit, menuItem }) {
  const { t, i18n } = useTranslation();
  
  // Состояние для выбранного языка редактирования
  const [editingLanguage, setEditingLanguage] = useState('ru');
  
  // Состояния для переводов названий и описаний
  const [nameTranslations, setNameTranslations] = useState({
    ru: menuItem?.name?.ru || '',
    en: menuItem?.name?.en || '',
    et: menuItem?.name?.et || ''
  });
  
  const [descriptionTranslations, setDescriptionTranslations] = useState({
    ru: menuItem?.description?.ru || '',
    en: menuItem?.description?.en || '',
    et: menuItem?.description?.et || ''
  });

  const [image, setImage] = useState(menuItem?.image || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [temperature, setTemperature] = useState(menuItem?.temperature || []);
  const [category, setCategory] = useState(menuItem?.category || '');
  const [categories, setCategories] = useState([]);
  const [pricePoints, setpricePoints] = useState(menuItem?.pricePoints || '');
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }, []);

  // Функция для обновления перевода названия
  const updateNameTranslation = (value) => {
    setNameTranslations(prev => ({
      ...prev,
      [editingLanguage]: value
    }));
  };

  // Функция для обновления перевода описания
  const updateDescriptionTranslation = (value) => {
    setDescriptionTranslations(prev => ({
      ...prev,
      [editingLanguage]: value
    }));
  };

  // Языковые кнопки
  const languages = [
    { code: 'ru', name: 'РУ', flag: '🇷🇺' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'et', name: 'ET', flag: '🇪🇪' }
  ];

  return (
    <form
      onSubmit={ev =>
        onSubmit(ev, {
          image, 
          name: nameTranslations,
          description: descriptionTranslations,
          basePrice, 
          sizes, 
          extraIngredientPrices, 
          category, 
          temperature, 
          pricePoints
        })
      }
      className="mt-8 max-w-2xl mx-auto"
    >
      <div
        className="md:grid items-start gap-4"
        style={{ gridTemplateColumns: '.3fr .7fr' }}
      >
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>
        <div className="grow">
          {/* Переключатель языков */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">{t('menuItem.editLanguage')}</label>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setEditingLanguage(lang.code)}
                  className={`px-3 py-2 rounded border flex items-center gap-2 ${
                    editingLanguage === lang.code 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <label>{t('menuItem.name')} ({editingLanguage.toUpperCase()})</label>
          <input
            type="text"
            value={nameTranslations[editingLanguage]}
            onChange={ev => updateNameTranslation(ev.target.value)}
            placeholder={`${t('menuItem.name')} (${editingLanguage.toUpperCase()})`}
          />

          <label>{t('menuItem.description')} ({editingLanguage.toUpperCase()})</label>
          <input
            type="text"
            value={descriptionTranslations[editingLanguage]}
            onChange={ev => updateDescriptionTranslation(ev.target.value)}
            placeholder={`${t('menuItem.description')} (${editingLanguage.toUpperCase()})`}
          />

          {/* Показать переводы других языков для справки */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-2">{t('menuItem.otherTranslations')}:</div>
            {languages.filter(lang => lang.code !== editingLanguage).map(lang => (
              <div key={lang.code} className="text-xs text-gray-500 mb-1">
                <span className="font-medium">{lang.flag} {lang.name}:</span>
                <br />
                <span>{t('menuItem.name')}: {nameTranslations[lang.code] || t('menuItem.notTranslated')}</span>
                <br />
                <span>{t('menuItem.description')}: {descriptionTranslations[lang.code] || t('menuItem.notTranslated')}</span>
              </div>
            ))}
          </div>

          <label>{t('menuItem.category')}</label>
          <select value={category} onChange={ev => setCategory(ev.target.value)}>
            {categories?.length > 0 && categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label>{t('menuItem.basePrice')}</label>
          <input
            type="text"
            value={basePrice}
            onChange={ev => setBasePrice(ev.target.value)}
          />

          <label>{t('menuItem.pricePoints')}</label>
          <input
            type="text"
            value={pricePoints}
            onChange={ev => setpricePoints(ev.target.value)}
          />

          <MenuItemPriceProps name={t('menuItem.sizes')}
                             addLabel={t('menuItem.addSize')}
                             props={sizes}
                             setProps={setSizes} />

          <MenuItemPriceProps name={t('menuItem.temperature')}
                             addLabel={t('menuItem.addTemperature')}
                             props={temperature}
                             setProps={setTemperature} />

          <MenuItemPriceProps name={t('menuItem.extraIngredients')}
                             addLabel={t('menuItem.addExtras')}
                             props={extraIngredientPrices}
                             setProps={setExtraIngredientPrices} />

          <button type="submit" className="bg-primary text-white px-6 py-2 rounded">
            {t('menuItem.save')}
          </button>
        </div>
      </div>
    </form>
  );
}
