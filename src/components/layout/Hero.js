import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div>
      <section className="hero md:mt-4 mb-12 gap-8 px-2">
          <h2 className="text-4xl font-semibold">
            {t('hero.part1')} <br />
            {t('hero.part2')} <br />
            {t('hero.part3')}&nbsp;
            <span className="text-primary">
              {t('hero.part4')}
            </span>
          </h2>
      </section>
    </div>
  );
}
