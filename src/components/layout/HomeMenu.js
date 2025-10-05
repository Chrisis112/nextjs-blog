'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function HomeMenu() {
  const { t } = useTranslation();
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setBestSellers(menuItems.slice(-3));
      });
    });
  }, []);

  return (
    <section className="">
      <div className="absolute left-0 right-0 w-full justify-start">
        <div  className=" absolute left-0 -top-[70px] text-left -z-10"></div>
        <div className="absolute -top-[300px] right-0 -z-10"></div>
      </div>
      <div className="text-center mb-4">
        <SectionHeaders
          subHeader={t('homeMenu.subHeader')}
          mainHeader={t('homeMenu.mainHeader')} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {bestSellers?.length > 0 && bestSellers.map(item => (
          <MenuItem key={item._id} {...item} />
        ))}
      </div>
    </section>
  );
}
