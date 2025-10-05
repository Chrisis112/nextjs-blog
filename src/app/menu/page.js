'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';

export default function MenuPage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ru';
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories));
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
      console.log(menuItems)
    });
  }, [menuItems]);

  // Функция для универсального вывода имени категории
  const getCategoryName = (name) => {
    if (!name) return '';
    return typeof name === 'string' 
      ? name 
      : (name[currentLang] || name['ru'] || '');
  };

  return (
    <section className="mt-8">
      {categories?.length > 0 && categories.map(c => (
        <div key={c._id}>
          <div className="text-center">
            <SectionHeaders mainHeader={getCategoryName(c.name)} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {menuItems.filter(item => String(item.category) === String(c._id)).map(item => (
              <MenuItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
