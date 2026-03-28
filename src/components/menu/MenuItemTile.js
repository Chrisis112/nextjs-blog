/* 
import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";
import { useTranslation } from "react-i18next";
/* 
port default function MenuItemTile({ onAddToCart, ...item }) {
  const { i18n } = useTranslation();

  const {
    image,
    description,
    name,
    basePrice,
    sizes = [],
    extraIngredientPrices = [],
    temperature = [],
    pricePoints,
    locations
  } = item;

  const hasSizesOrExtras =
    sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;

  const currentLang = i18n.language;

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  let locationsText = "";
  if (locations && (Array.isArray(locations) ? locations.length : locations)) {
    if (Array.isArray(locations)) {
      locationsText = locations.join(", ");
    } else {
      locationsText = locations;
    }
  }

  return (

   
    <div
      className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all flex flex-col justify-between mx-auto"
      style={{
        width: "100%",
        maxWidth: "300px",
        minHeight: "460px",
        maxHeight: "460px",
        boxSizing: "border-box",
      }}
    >
      

      <div className="flex flex-col items-center">
        <div
          className="mx-auto mb-3"
          style={{
            width: "180px",
            height: "180px",
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >

          <Image
            src={image || "/default-image.png"}
            alt={getLocalizedText(name)}
            fill
            style={{ objectFit: "cover" }}
            sizes="180px"
          />
        </div>

        <h4
          className="font-semibold text-xl mb-2 text-center"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            lineHeight: "1.5"
          }}
        >
          {getLocalizedText(name)}
        </h4>

        {locationsText && (
          <div className="text-sm text-gray-600 mb-2 px-2"
            style={{
              minHeight: "20px",
              maxHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {locationsText}
          </div>
        )}

        <p
          className="text-gray-500 text-sm mb-4 px-2"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            lineHeight: "1.3"
          }}
        >
          {getLocalizedText(description)}
        </p>
      </div>


      <div className="mt-auto">
        <AddToCartButton
          image={image}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
          basePrice={basePrice}
          PricePoints={pricePoints}
        />
      </div>
    </div>
  
  );
}
  */

/* 
import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";
import { useTranslation } from "react-i18next";
/* 
port default function MenuItemTile({ onAddToCart, ...item }) {
  const { i18n } = useTranslation();

  const {
    image,
    description,
    name,
    basePrice,
    sizes = [],
    extraIngredientPrices = [],
    temperature = [],
    pricePoints,
    locations
  } = item;

  const hasSizesOrExtras =
    sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;

  const currentLang = i18n.language;

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  let locationsText = "";
  if (locations && (Array.isArray(locations) ? locations.length : locations)) {
    if (Array.isArray(locations)) {
      locationsText = locations.join(", ");
    } else {
      locationsText = locations;
    }
  }

  return (

   
    <div
      className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all flex flex-col justify-between mx-auto"
      style={{
        width: "100%",
        maxWidth: "300px",
        minHeight: "460px",
        maxHeight: "460px",
        boxSizing: "border-box",
      }}
    >
      

      <div className="flex flex-col items-center">
        <div
          className="mx-auto mb-3"
          style={{
            width: "180px",
            height: "180px",
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >

          <Image
            src={image || "/default-image.png"}
            alt={getLocalizedText(name)}
            fill
            style={{ objectFit: "cover" }}
            sizes="180px"
          />
        </div>

        <h4
          className="font-semibold text-xl mb-2 text-center"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            lineHeight: "1.5"
          }}
        >
          {getLocalizedText(name)}
        </h4>

        {locationsText && (
          <div className="text-sm text-gray-600 mb-2 px-2"
            style={{
              minHeight: "20px",
              maxHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {locationsText}
          </div>
        )}

        <p
          className="text-gray-500 text-sm mb-4 px-2"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            lineHeight: "1.3"
          }}
        >
          {getLocalizedText(description)}
        </p>
      </div>


      <div className="mt-auto">
        <AddToCartButton
          image={image}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
          basePrice={basePrice}
          PricePoints={pricePoints}
        />
      </div>
    </div>
  
  );
}
  */

'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function MenuItemTile({ onAddToCart, ...item }) {
  const { i18n } = useTranslation();

  const {
    image,
    description,
    name,
    basePrice,
    sizes = [],
    extraIngredientPrices = [],
    temperature = [],
    pricePoints,
    locations,
  } = item;

  const hasSizesOrExtras =
    sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;

  const currentLang = i18n.language;

  const getLocalizedText = (field) => {
    if (!field) return '';
    return typeof field === 'string'
      ? field
      : (field[currentLang] || field['ru'] || '');
  };

  let locationsText = '';
  if (locations && (Array.isArray(locations) ? locations.length : locations)) {
    if (Array.isArray(locations)) {
      locationsText = locations.join(', ');
    } else {
      locationsText = locations;
    }
  }

  // 🔺 state для открытия фото
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const imageSrc = getLocalizedText(image) || '/default-image.png';

  return (
    <>
      {/* Большое модальное фото */}
      {isImageModalOpen && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    onClick={() => setIsImageModalOpen(false)}
  >
    {/* 🔺 блок, который можно прокручивать */}
    <div
      className="w-full h-full max-w-5xl max-h-[80vh] overflow-auto rounded-lg bg-black/40 relative"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-4">
        <Image
          src={imageSrc}
          alt={getLocalizedText(name)}
          width={1200}
          height={800}
          className="max-w-full h-auto rounded-lg shadow-lg"
          // height и width нужны для оптимального размера
        />
      </div>
      <button
        className="absolute top-4 right-4 text-white text-2xl z-10"
        onClick={() => setIsImageModalOpen(false)}
      >
        ✕
      </button>
    </div>
  </div>
)}


      <div
        className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all flex flex-col justify-between mx-auto"
        style={{
          width: '100%',
          maxWidth: '300px',
          minHeight: '460px',
          maxHeight: '460px',
          boxSizing: 'border-box',
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className="mx-auto mb-3 cursor-pointer"
            style={{
              width: '180px',
              height: '180px',
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              // лёгкий эффект при наведении
              transition: 'transform 0.2s',
              transform: 'scale(1)',
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => setIsImageModalOpen(true)}
          >
            <Image
              src={imageSrc}
              alt={getLocalizedText(name)}
              fill
              style={{ opacity: 0 }}
              sizes="180px"
            />
            {/* Можно добавить лупу */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-sm"
              style={{ pointerEvents: 'none' }}
            >
              Zoom
            </div>
          </div>

          <h4
            className="font-semibold text-xl mb-2 text-center"
            style={{
              minHeight: '60px',
              maxHeight: '60px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              lineHeight: '1.5',
            }}
          >
            {getLocalizedText(name)}
          </h4>

          {locationsText && (
            <div
              className="text-sm text-gray-600 mb-2 px-2"
              style={{
                minHeight: '20px',
                maxHeight: '20px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {locationsText}
            </div>
          )}

          <p
            className="text-gray-500 text-sm mb-4 px-2"
            style={{
              minHeight: '60px',
              maxHeight: '60px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              lineHeight: '1.3',
            }}
          >
            {getLocalizedText(description)}
          </p>
        </div>

      </div>
    </>
  );
}
