'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  const [agreement, setAgreement] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    setAgreement(false);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setUserCreated(true);
    } else {
      setError(true);
    }
    setCreatingUser(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        {t('registerPage.register')}
      </h1>
      {userCreated && (
        <div className="my-4 text-center">
          {t('registerPage.userCreated')}<br />
          {t('registerPage.nowYouCan')}{' '}
          <Link className="underline" href={'/login'}>
            {t('registerPage.login')} &raquo;
          </Link>
        </div>
      )}
      {error && (
        <div className="my-4 text-center">
          {t('registerPage.errorOccurred')}<br />
          {t('registerPage.tryAgainLater')}
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input required type="email" placeholder={t('registerPage.emailPlaceholder')} value={email}
          disabled={creatingUser}
          onChange={ev => setEmail(ev.target.value)} />
        <input required type="password" placeholder={t('registerPage.passwordPlaceholder')} value={password}
          disabled={creatingUser}
          onChange={ev => setPassword(ev.target.value)} />
        <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="agreementCb">
          <input
            required type="checkbox"
            id="agreementCb"
            value={agreement}
            disabled={creatingUser}
            onChange={ev => setAgreement(ev.target.checked)}
          />
          <span>
            {t('registerPage.agreeWith')}{' '}
            <Link className="underline" href={'/terms'}>{t('registerPage.terms')}</Link>{' '}
            {t('registerPage.and')}{' '}
            <Link className="underline" href={'/privacy'}>{t('registerPage.privacy')}</Link>
          </span>
        </label>
        <button type="submit" disabled={creatingUser}>
          {t('registerPage.registerButton')}
        </button>
        <div className="my-4 text-center text-gray-500">
          {t('registerPage.orLoginWithProvider')}
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex gap-4 justify-center"
        >
          <Image src={'/google.png'} alt={t('registerPage.googleAlt')} width={24} height={24} />
          {t('registerPage.signUpWithGoogle')}
        </button>
        <div className="my-4 text-center text-gray-500">
          {t('registerPage.agreementNote')}
          <Link className="underline" href={'/terms'}>{t('registerPage.terms')}</Link>{' '}
          <Link className="underline" href={'/privacy'}>{t('registerPage.privacy')}</Link>
        </div>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          {t('registerPage.existingAccount')}{' '}
          <Link className="underline" href={'/login'}>
            {t('registerPage.loginHere')} &raquo;
          </Link>
        </div>
      </form>
    </section>
  );
}
