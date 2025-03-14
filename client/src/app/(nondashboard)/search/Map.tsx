import { useRef } from 'react';
import mapboxGl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxGl.accessToken = process.env;

const MapComponent = () => {
  const mapContainerRef = useRef(null);

  return <div>Map</div>;
};

export default MapComponent;
