import {AppProvider} from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Comfortaa} from 'next/font/google'
import './globals.css'
import {Toaster} from "react-hot-toast";
import Link from "next/link";

const roboto = Comfortaa({ subsets: ['latin'], weight: ['400', '500', '700'] });



export const metadata = {
  title: 'NaiChai bubble tea',
  description: 'We are all about bringing a taste of China NaiChai to Estonia through our delicious bubble tea. Our journey began with a love for authentic ingredients and a desire to share the taste.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header   />
            
            {children}
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              &copy; 2024 All rights reserved
              <div>
              <Link className="underline" href={'/terms'}>Kasutustingimused</Link>
              <div id="Privacy">
              <Link className="underline" href={'/terms/#privacy'}>Privaatsuspoliitika</Link>
              </div>
              </div>
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  )
}
