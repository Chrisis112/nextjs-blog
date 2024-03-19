export default function SectionHeaders({subHeader,mainHeader}) {
  return (
    <>
      <h3 colour= '#4c2600' className="uppercase text-400 font-semibold leading-4">
        {subHeader}
      </h3>
      <h2 className="text-primary font-bold text-4xl italic">
        {mainHeader}
      </h2>
    </>
  );
}