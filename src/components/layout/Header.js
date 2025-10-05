import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import Flag from "react-world-flags";

const flags = {
  ru: 'RU',
  en: 'GB',
  et: 'EE',
};

function LanguageSwitcher({ large = false }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const flagWidth = large ? 48 : 24;
  const flagHeight = large ? 32 : 16;
  const btnPadding = large ? 'p-2' : 'p-1';
  const fontSize = large ? 'text-lg' : 'text-base';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
<button
  onClick={() => setOpen(!open)}
  aria-haspopup="true"
  aria-expanded={open}
  className={`flex items-center gap-2 border rounded ${btnPadding} shrink-0`}  // <- добавьте shrink-0
>
  <Flag
    code={flags[lang]}
    style={{
      width: flagWidth,
      height: flagHeight,
      minWidth: flagWidth,
      minHeight: flagHeight,
      borderRadius: 3,
      display: 'block'
    }}
  />
</button>

      {open && (
        <div
          className={`absolute mt-2 bg-white border rounded shadow-lg z-50 ${large ? "w-36" : "w-28"} `}
          style={{ marginLeft: '-8px', padding: large ? 8 : undefined }}
          role="menu"
          aria-orientation="vertical"
          aria-label="Language selector"
        >
          {Object.entries(flags).map(([lng, countryCode]) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={`w-full text-left ${fontSize} p-2 flex items-center gap-4 hover:bg-gray-100 ${
                lang === lng ? 'bg-gray-200 font-semibold' : ''
              }`}
              role="menuitem"
            >
              <Flag code={countryCode} style={{ width: flagWidth, height: flagHeight, borderRadius: 3 }} />
              <span className={`capitalize ${fontSize}`}>{lng}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthLinks({ status, userName }) {
  const { t } = useTranslation();
  // ...
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          {t('nav.hello', { name: userName })}
        </Link>
        <button onClick={() => signOut()} className="bg-primary rounded-full text-white px-8 py-2">
          {t('nav.logout')}
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link className="bg-primary rounded-full text-white px-8 py-2" href={'/login'}>
          {t('nav.login')}
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
    const { t } = useTranslation();
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50 border-b h-16 flex items-center px-2">
      {/* Mobile Header */}
      <div className="flex items-center md:hidden justify-between w-full h-12">
        <Link className="text-primary font-semibold text-2xl" href={'/'}>
          <Image src={'/logo123.png'} width={40} height={30} alt={'logo'} />
        </Link>
        {/* Сделаем видимый и большой LanguageSwitcher */}
        <div className="mr-2 flex items-center flex">
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-2 h-full">
          <Link href={'/cart'} className="relative">
            <ShoppingCart style={{ width: 24, height: 24 }} />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-1 border ml-2"
            style={{ minWidth: 28, minHeight: 28 }}
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="absolute top-12 left-0 right-0 p-2 bg-gray-200 rounded-b-lg flex flex-col gap-2 text-center z-40"
        >
          {/* // LanguageSwitcher в меню по желанию */}
          <div className="flex items-center justify-center" />
          <Link href={'/'}>{t('nav.home')}</Link>
          <Link href={'/menu'}>{t('nav.menu')}</Link>
          <Link href={'/#about'}>{t('nav.about')}</Link>
          <Link href={'/#contact'}>{t('nav.contact')}</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between w-full h-16">
        <nav className="flex items-center gap-4 text-gray-500 font-semibold h-16">
          <Link className="text-primary font-semibold text-2xl" href={'/'}>
            <Image src={'/logo123.png'} width={50} height={50} alt={'logo'} />
          </Link>
          <Link href={'/'}>{t('nav.home')}</Link>
          <Link href={'/menu'}>{t('nav.menu')}</Link>
          <Link href={'/#about'}>{t('nav.about')}</Link>
          <Link href={'/#contact'}>{t('nav.contact')}</Link>
        </nav>
        <div className="flex items-center gap-4 h-16">
          <LanguageSwitcher />
          <AuthLinks status={status} userName={userName} />
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}