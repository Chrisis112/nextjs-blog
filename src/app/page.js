import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import TrendingSlider from "@/components/TrendingSlider";


export default function Home() {
  
  return (
    <>
    <SpeedInsights/>
    <Analytics/>
    <img className="max-h-auto max-h-25 block mx-auto" src="https://i.imgur.com/DL8lA2O.png"></img>
   <TrendingSlider/>
      <Hero />
      
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Our story'}
          mainHeader={'About us'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
          We are all about bringing a taste of China to Estonia through our delicious bubble teas. Our journey began with a love for authentic ingredients and a desire to share the special tastes we discovered during our life in Asia. Our owner spent many years living in China, soaking up the culture and flavors of the authentic Asia.
          </p>
          <p>We are all about exploration here. Mixing and matching flavors, discovering new combinations, it is what keeps us excited and inspired every day. And of course, we only use the original ingredients because we believe in offering the best to our customers.</p>
          <p>So, whether you are craving a classic bubble tea or feeling adventurous and want to try something new, we have got you covered. Come join us on this tasty journey, and lets explore the flavors together, one sip at a time!</p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'Don\'t hesitate'}
          mainHeader={'Contact us'}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" href="tel:+46738123123">
            +372 5665 0230
          </a>
        </div>
      </section>
    </>
  )
}