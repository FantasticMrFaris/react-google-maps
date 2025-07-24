import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { SportsMap, SportsVenue } from './SportsMap';

interface SportsMapContainerProps {
  venues: SportsVenue[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onVenueSelect?: (venue: SportsVenue | null) => void;
  selectedVenueId?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export const SportsMapContainer: React.FC<SportsMapContainerProps> = (props) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="map-error">
        <h3>Google Maps API Key Required</h3>
        <p>Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables.</p>
      </div>
    );
  }

  return (
    <APIProvider 
      apiKey={apiKey}
      libraries={['marker', 'places']}
    >
      <SportsMap {...props} />
    </APIProvider>
  );
};