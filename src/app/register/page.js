"use client";
import {signIn} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import Agreement from "@/components/menu/Agreement";

export default function RegisterPage() {
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
    setAgreement(false)
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {'Content-Type': 'application/json'},
    });
    if (response.ok) {
      setUserCreated(true);
    }
    else {
      setError(true);
    }
    setCreatingUser(false);
  }
 
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Register
      </h1>
      {userCreated && (
        <div className="my-4 text-center">
          User created.<br />
          Now you can{' '}
          <Link className="underline" href={'/login'}>Login &raquo;</Link>
        </div>
      )}
      {error && (
        <div className="my-4 text-center">
          An error has occurred.<br />
          Please try again later
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input required type="email" placeholder="email" value={email}
               disabled={creatingUser}
               onChange={ev => setEmail(ev.target.value)} />
        <input required  type="password" placeholder="password" value={password}
               disabled={creatingUser}
                onChange={ev => setPassword(ev.target.value)}/>
                <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
              required type="checkbox"
                value={agreement}
                disabled={creatingUser}
                onChange={ev => setAgreement(ev.target.checked)}
              />
              <span>Nõustun <Link className="underline" href={'/terms'}>teenustetingimuste </Link> ja <Link className="underline" href={'/privacy'}>privaatsuspoliitika</Link></span>
            </label>
        <button type="submit" disabled={creatingUser}>
          Register
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <button
          onClick={() => signIn('google', {callbackUrl:'/'})}
          className="flex gap-4 justify-center">
          <Image src={'/google.png'} alt={''} width={24} height={24} />
          Sign up with Google
        </button> 
        <div className="my-4 text-center text-gray-500" >
        Vajutates nõustute <Link className="underline" href={'/terms'}>teenustetingimuste </Link> ja <Link className="underline" href={'/privacy'}>privaatsuspoliitika</Link> töötlemisega</div>
        {/* <button type="button" onClick={() => signIn('apple', {callbackUrl: '/'})}
                className="flex gap-5 justify-center">
          <Image src={'/apple.png'} alt={''} width={24} height={24} />
          Login with apple
        </button> */}
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Existing account?{' '}
          <Link className="underline" href={'/login'}>Login here &raquo;</Link>
          
        </div>
      </form>
    </section>
  );
}