'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function LocationModal({ locations, onConfirm }) {
  const [selected, setSelected] = useState('');
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">{t('menuItem.pickLocation')}</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
{locations.map(loc => (
  <button
    key={loc}
    onClick={() => setSelected(loc)}
    className={`flex items-center gap-2 rounded bg-gray-200 text-black px-4 py-2`}
    style={{
      fontSize: '90%',
      minHeight: '2.5rem',
      width: '20rem', // фиксированная ширина для всех кнопок
    }}
  >
    <span
      className={`w-3 h-3 rounded-full inline-block border border-black ${
        selected === loc ? 'bg-green-500' : 'bg-gray-400'
      }`}
      style={{ flexShrink: 0 }} // чтобы кружок не сжимался
    />
    <span className="flex-1 text-left">{loc}</span> {/* текст занимает оставшееся пространство */}
  </button>
))}

        </div>
        <button
          disabled={!selected}
          onClick={() => onConfirm(selected)}
          className={`w-full py-2 rounded text-white ${
            selected ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
{t('menuItem.accept')}
        </button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ru';
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);

    fetch('/api/menu-items')
      .then(res => res.json())
      .then(items => {
        setMenuItems(items);
        const locationsSet = new Set();
        items.forEach(item => {
          if(item.locations && item.locations.length > 0){
            item.locations.forEach(loc => locationsSet.add(loc));
          }
        });
        setAllLocations([...locationsSet]);
      });
  }, []);

  const getCategoryName = (name) =>
    !name ? '' : (typeof name === 'string' ? name : (name[currentLang] || name['ru'] || ''));

  const filterByLocation = (item) => {
    if (!selectedLocation) return true;            // если не выбрана локация, показываем все
    if (!item.locations || item.locations.length === 0) return true; // без локаций показываем всегда
    return item.locations.includes(selectedLocation);
  };

  const handleConfirmLocation = (loc) => {
    setSelectedLocation(loc);
    setModalVisible(false);
  };

  return (
    <>
      {modalVisible && <LocationModal locations={allLocations} onConfirm={handleConfirmLocation} />}

      {!modalVisible && (
        <section className="mt-8">
          {categories.map(c => (
            <div key={c._id}>
              <div className="text-center">
                <SectionHeaders mainHeader={getCategoryName(c.name)} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
                {menuItems
                  .filter(item => String(item.category) === String(c._id))
                  .filter(filterByLocation)
                  .map(item => <MenuItem key={item._id} {...item} />)}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
