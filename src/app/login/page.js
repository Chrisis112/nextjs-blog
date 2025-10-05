'use client';
import {signIn} from "next-auth/react";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {

    
    ev.preventDefault();
    setLoginInProgress(true);

    await signIn('credentials', {email, password, callbackUrl: '/'});

    setLoginInProgress(false);
  }
  return (
    <section className="mt-8">

      <h1 className="text-center text-primary text-4xl mb-4">
  {t('nav.login')}
      </h1>

      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder="email" value={email}
               disabled={loginInProgress}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder="password" value={password}
               disabled={loginInProgress}
               onChange={ev => setPassword(ev.target.value)}/>
               <button
  type="button"
  onClick={() => signIn('google', { callbackUrl: '/' })}
  className="flex gap-4 justify-center"
>
  <Image src={'/google.png'} alt={t('registerPage.googleAlt')} width={24} height={24} />
  {t('registerPage.signUpWithGoogle')}
</button>
        <button disabled={loginInProgress} type="submit">  {t('nav.login')}</button>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          
          <Link className="underline" href={'/register'}>  {t('loginPage.createAccount')} &raquo;</Link>
        </div>
      </form>
    </section>
  );
}