'use client';
import React from 'react';  // ← ДОБАВЬ ЭТОТ ИМПОРТ!

export default function GoogleMap({ lat, lng, zoom = 16, className = '' }) {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: zoom,
        center: { lat: lat, lng: lng },
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Маркер NaiChai
      new window.google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'NaiChai Bubble Tea Bar'
      });
    }
  }, [lat, lng, zoom]);

  return (
    <div 
      ref={mapRef}
      className={`w-full h-96 md:h-[400px] rounded-xl shadow-lg ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
}
