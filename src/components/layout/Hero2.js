import { useTranslation } from 'react-i18next';

export default function Hero2() {
  const { t } = useTranslation();

  return (
    <section className="hero md:mt-4">
      <div className="">
        <h1 className="text-4xl font-semibold">
          {t('hero2.part1')}&nbsp;
          <span className="text-primary">
            {t('hero2.part2')}
          </span>
        </h1>
      </div>
    </section>
  );
}
