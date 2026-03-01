import { AppProvider } from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Comfortaa } from 'next/font/google';
import './globals.css';
import { Toaster } from "react-hot-toast";
import ClientWrapper from "@/components/ClientWrapper";
import Link from "next/link";

const roboto = Comfortaa({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function RootLayout({ children }) {
  return (
    <html lang="et">
      <body className={roboto.className}>
        {/* i18n только для клиентских компонентов */}

        <AppProvider>
          <main className="max-w-4xl mx-auto p-2 pt-20 min-h-screen flex flex-col gap-2">
            <Toaster />
            <Header />
            
            <ClientWrapper>
              {children}
            </ClientWrapper>
            
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              © 2025 All rights reserved
              <div>
                <Link className="underline" href={'/terms'}>Kasutustingimused</Link>
                <div id="Privacy">
                  <Link className="underline" href={'/terms/#privacy'}>Privaatsuspoliitika</Link>
                </div>
              </div>
            </footer>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
