import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { SpeedInsights } from "@vercel/speed-insights/next"
import TrendingSlider from "@/components/TrendingSlider";
import Hero2 from "@/components/layout/Hero2";
import Image from "next/image";


export default function Home() {

  
  return (
    
    <>
    <SpeedInsights/>
    <Hero2/>
    <Image alt="Boba" width={700} height={700} className="max-h-auto max-h-25 block mx-auto" src="https://i.imgur.com/DL8lA2O.png"/>
   <TrendingSlider/>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
      <SectionHeaders
          subHeader={'Meie edu lugu'}
          mainHeader={'Meist'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
          Meie eesmärk on tuua Eestisse Hiina maitse läbi meie maitsvate mulliteede. Meie teekond sai alguse armastusest autentsete koostisosade vastu ja soovist jagada Aasias elu jooksul avastatud erilisi maitseid. Meie omanik elas aastaid Hiinas, nautides autentse Aasia kultuuri ja maitseid.
          </p>
          <p>Me kõik tegeleme siin uurimisega. Maitsete segamine ja sobitamine, uute kombinatsioonide avastamine on see, mis meid iga päev elevil ja inspireerituna hoiab. Ja loomulikult kasutame ainult originaal koostisosi, sest usume, et pakume oma klientidele parimat.</p>
          <p>Nii et olenemata sellest, kas ihaldate klassikalist mulliteed või tunnete end seiklushimulisena ja soovite proovida midagi uut, oleme teiega seotud. Tulge meiega sellel maitsval teekonnal ja uurige koos maitseid, üks lonks korraga!</p>
        </div>
     <br></br>
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
          mainHeader={'Kontakt'}
        />
            <div className="mt-2">
          <a className="text-2xl text-gray-500">
          NaiChai OÜ(16827724)
        </a>
        </div>
            <div className="mt-2">
          <a className="text-2xl text-gray" >
          KMKR:EE102661046
        </a>
        </div>
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
        <a className="text-2xl text-gray-500" href="https://maps.app.goo.gl/GQ5jHkTBXVvaJ8Hw5">
          Mündi 3
         
        </a>
        </div>
        <div className=" max-h-auto max-h-25 block mx-auto flex block mx-auto ">
          <iframe className=" max-h-auto max-h-25 block mx-auto flex block mx-auto " src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.721310167819!2d24.742489877931824!3d59.43772247466704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469293f2ddec595f%3A0xd52d81a807bc04df!2sNaiChai%20Bubble%20Tea%20Bar!5e0!3m2!1sru!2see!4v1712001791589!5m2!1sru!2see" width="300" height="400" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          
        </div>
      </section>
    </>
  )
}
