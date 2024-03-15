'use client';
import {signIn} from "next-auth/react";
import Image from "next/image";
import {useState} from "react";
import RegisterPage from "../register/page";
import Link from "next/link";
export default function LoginPage() {
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
        Login
      </h1>
      
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder="email" value={email}
               disabled={loginInProgress}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder="password" value={password}
               disabled={loginInProgress}
               onChange={ev => setPassword(ev.target.value)}/>
        <button disabled={loginInProgress} type="submit">Login</button>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          
          <Link className="underline" href={'/register'}>Create account &raquo;</Link>
        </div>
        <div className="my-4 text-center text-gray-500">
          or 
        </div>
        <button type="button" onClick={() => signIn('google', {callbackUrl: '/'})}
                className="flex gap-4 justify-center">
          <Image src={'/google.png'} alt={''} width={24} height={24} />
          Login with google
        </button>
        {/* <button type="button" onClick={() => signIn('apple', {callbackUrl: '/'})}
                className="flex gap-5 justify-center">
          <Image src={'/apple.png'} alt={''} width={24} height={24} />
          Login with apple
        </button> */}
      </form>
    </section>
  );
}