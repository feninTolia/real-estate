'use client';
import { useGetPropertiesQuery } from '@/state/api';
import { useAppSelector } from '@/state/redux';
import { Property } from '@/types/prismaTypes';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/fenintolja/cm88hx6vz00c601qz55rf4ba5',
      center: filters.coordinates || [-74.5, 40],
      zoom: 9,
    });

    properties.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector('path[fill="#3FB1CE"]');
      if (path) {
        return path.setAttribute('fill', '#000000');
      }
    });

    const resizeMap = () => setTimeout(() => map.resize(), 700);
    resizeMap();

    return () => map.remove();
  }, [filters.coordinates, isError, isLoading, properties]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError || !properties) {
    return <p>Failed to load properties</p>;
  }

  return (
    <div className="basis-5/12 grow relative rounded-xl bg-primary-300">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  return new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
};

export default MapComponent;
