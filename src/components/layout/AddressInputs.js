import { useTranslation } from 'react-i18next';

export default function AddressInputs({ addressProps, setAddressProp, disabled = false }) {
  const { t } = useTranslation();

  const { phone, streetAddress, postalCode, city, country } = addressProps;
  return (
    <>
      <label>{t('form.phone')}</label>
      <input
        disabled={disabled}
        type="tel" placeholder={t('form.phonePlaceholder')}
        value={phone || ''} onChange={ev => setAddressProp('phone', ev.target.value)} />

      <label>{t('form.street')}</label>
      <input
        disabled={disabled}
        type="text" placeholder={t('form.streetPlaceholder')}
        value={streetAddress || ''} onChange={ev => setAddressProp('streetAddress', ev.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>{t('form.postal')}</label>
          <input
            disabled={disabled}
            type="text" placeholder={t('form.postalPlaceholder')}
            value={postalCode || ''} onChange={ev => setAddressProp('postalCode', ev.target.value)}
          />
        </div>
        <div>
          <label>{t('form.city')}</label>
          <input
            disabled={disabled}
            type="text" placeholder={t('form.cityPlaceholder')}
            value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
          />
        </div>
      </div>

      <label>{t('form.country')}</label>
      <input
        disabled={disabled}
        type="text" placeholder={t('form.countryPlaceholder')}
        value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
      />
    </>
  );
}
