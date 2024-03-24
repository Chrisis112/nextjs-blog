export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
        Where<br />
        your<br />
        tea journey&nbsp;
          <span className="text-primary">
          begins 
          </span>
        </h1>
       
      </div>
      {/* <div className="relative hidden md:block">
       <Image src={'/pizza.png'} layout={'fill'} objectFit={'contain'} alt={'pizza'} />
      </div> */}
    </section>
  );
}