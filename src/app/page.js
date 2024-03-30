import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import TrendingSlider from "@/components/TrendingSlider";
import Hero2 from "@/components/layout/Hero2";
import Image from "next/image";

export default function Home() {
  
  return (
    <>
    <SpeedInsights/>
    <Analytics/>
    <Hero2/>
    <Image alt="Boba" width={700} height={700} className="max-h-auto max-h-25 block mx-auto" src="https://i.imgur.com/DL8lA2O.png"/>
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
        <div className="mt-4">
          <a className="text-2xl underline text-gray-500" href="tel:+372 5665 0230">
            +372 5665 0230
          </a> 
          <div className="mt-2">
          <a className="text-2xl underline text-gray-500" href="mailto:info@naichai.ee" >
          info@naichai.ee
        </a>
        </div>
        <br/>
        <div className="mt-2">
        <a className="text-2xl  text-gray-500" >
          Mündi 3
         
        </a>
        </div>
        <div className=" max-h-auto max-h-25 block mx-auto flex block mx-auto ">
          <iframe className=" max-h-auto max-h-25 block mx-auto flex block mx-auto " src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.7123922277576!2d24.742332876980115!3d59.437871202327905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692936246d2a049%3A0xb9a7adb20d277086!2sM%C3%BCndi%203%2C%2010123%20Tallinn!5e0!3m2!1sru!2see!4v1711325799134!5m2!1sru!2see" width="300" height="400" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          
        </div>
      </section>
    </>
  )
}