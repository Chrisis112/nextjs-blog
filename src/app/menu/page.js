'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ALL_LOCATIONS } from '@/libs/locations';

function LocationModal({ locations, onConfirm }) {
  const [selected, setSelected] = useState('');
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {t('menuItem.pickLocation')}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {locations.map(loc => (
            <button
              key={loc}
              onClick={() => setSelected(loc)}
              className="flex items-center gap-2 rounded bg-gray-200 text-black px-4 py-2 border border-black"
              style={{
                fontSize: '90%',
                minHeight: '2.5rem',
                width: '20rem',
              }}
            >
              <span
                className={`w-3 h-3 rounded-full inline-block border border-black ${
                  selected === loc ? 'bg-green-500' : 'bg-gray-400'
                }`}
                style={{ flexShrink: 0 }}
              />
              <span className="flex-1 text-left">{loc}</span>
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
  const [modalVisible, setModalVisible] = useState(true);

  // Мгновенно lокации, без fetch.
  const allLocations = ALL_LOCATIONS;

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);

    fetch('/api/menu-items')
      .then(res => res.json())
      .then(setMenuItems);
  }, []);

  const getCategoryName = (name) =>
    !name ? '' : (typeof name === 'string' ? name : (name[currentLang] || name['ru'] || ''));

  const filterByLocation = (item) => {
    if (!selectedLocation) return true;
    if (!item.locations || item.locations.length === 0) return true;
    return item.locations.includes(selectedLocation);
  };

  const handleConfirmLocation = (loc) => {
    setSelectedLocation(loc);
    setModalVisible(false);
  };

  return (
    <>
      {modalVisible && (
        <LocationModal
          locations={allLocations}
          onConfirm={handleConfirmLocation}
        />
      )}

      {!modalVisible && (
        <section className="mt-8 space-y-12">
          {categories.map(c => (
            <div key={c._id}>
              <div className="text-center">
                <SectionHeaders mainHeader={getCategoryName(c.name)} />
              </div>
<div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
  style={{ alignItems: 'stretch' }}
>
  {menuItems
    .filter(item => String(item.category) === String(c._id))
    .filter(filterByLocation)
    .map(item => (
      <div key={item._id} className="w-full max-w-sm">
        <MenuItem
          {...item}
          selectedLocation={selectedLocation}
        />
      </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
