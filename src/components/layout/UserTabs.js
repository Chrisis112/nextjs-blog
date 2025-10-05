'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';

export default function UserTabs({ isAdmin })  {
  const path = usePathname();
  const { t } = useTranslation();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link
        className={path === '/profile' ? 'active' : ''}
        href={'/profile'}
      >
        {t('userTabs.profile')}
      </Link>
      <Link
        className={path === '/orders' ? 'active' : ''}
        href={'/orders'}
      >
        {t('userTabs.orders')}
      </Link>
      
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            {t('userTabs.categories')}
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            {t('userTabs.menuItems')}
          </Link>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            {t('userTabs.users')}
          </Link> 
        </>
      )}
    </div>
  );
}
