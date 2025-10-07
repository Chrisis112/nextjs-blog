'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import { useProfile } from "@/components/UseProfile";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function UserForm({ user, onSave, locations }) {  // locations в пропсах обязательны
  const { t } = useTranslation();

  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const [seller, setSeller] = useState(user?.seller || false);
  const [selectedLocation, setSelectedLocation] = useState(user?.location || '');

  const { data: loggedInUserData } = useProfile();

  useEffect(() => {
    setSelectedLocation(user?.location || '');
  }, [user]);

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    else if (propName === 'streetAddress') setStreetAddress(value);
    else if (propName === 'postalCode') setPostalCode(value);
    else if (propName === 'city') setCity(value);
    else if (propName === 'country') setCountry(value);
  }

  // Защита для locations: если не передали, не использовать
  const safeLocations = Array.isArray(locations) ? locations : [];

  return (
    <div className="md:flex gap-4">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name: userName,
            image,
            phone,
            admin,
            seller,
            streetAddress,
            city,
            country,
            postalCode,
            location: selectedLocation,
          })
        }
      >
        {seller && safeLocations.length > 0 && (
          <div className="mb-4">
            <label htmlFor="location-select" className="block mb-2 font-semibold text-gray-700">
              {t('userForm.pickLocation') || "Выберите локацию"}
            </label>
            <select
              id="location-select"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
            >
              <option value="">{t('userForm.selectLocationPlaceholder') || "-- Выберите локацию --"}</option>
              {safeLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        )}

        <label>{t('userForm.nameLabel')}</label>
        <input
          type="text"
          placeholder={t('userForm.namePlaceholder')}
          value={userName} onChange={ev => setUserName(ev.target.value)}
        />

        <AddressInputs
          addressProps={{ phone, streetAddress, postalCode, city, country }}
          setAddressProp={handleAddressChange}
        />

        <span>
          {t('userForm.bonusPoints')}: {loggedInUserData?.points}
        </span>

        {loggedInUserData?.admin && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb" type="checkbox" value={'1'}
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>{t('userForm.admin')}</span>
            </label>

            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="sellerCb">
              <input
                id="sellerCb" type="checkbox" value={'1'}
                checked={seller}
                onChange={ev => setSeller(ev.target.checked)}
              />
              <span>{t('userForm.seller')}</span>
            </label>
          </div>
        )}

        <button type="submit">{t('userForm.save')}</button>
      </form>
    </div>
  );
}
