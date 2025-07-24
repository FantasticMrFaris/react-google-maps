import React, { useState, useCallback } from 'react';
import { SportsMapContainer, SportsVenue } from '../components/maps';
import { VenuesList } from '../components/VenuesList';
import { useSportsVenues } from '../hooks/useSportsVenues';
import './SportsVenuesPage.css';

const SPORTS_OPTIONS = [
  { value: '', label: 'All Sports' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'hockey', label: 'Hockey' }
];

export const SportsVenuesPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 40.7128,
    lng: -74.0060
  });

  const { venues, loading, error } = useSportsVenues({
    sport: selectedSport || undefined
  });

  const handleVenueSelect = useCallback((venue: SportsVenue | null) => {
    setSelectedVenueId(venue?.id || null);
    if (venue) {
      setMapCenter(venue.position);
    }
  }, []);

  const handleSportChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSport(event.target.value);
    setSelectedVenueId(null);
  }, []);

  if (error) {
    return (
      <div className="sports-venues-page error">
        <div className="error-message">
          <h2>Error Loading Venues</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sports-venues-page">
      <header className="page-header">
        <h1>Sports Venues</h1>
        <div className="filters">
          <label htmlFor="sport-filter">Filter by Sport:</label>
          <select
            id="sport-filter"
            value={selectedSport}
            onChange={handleSportChange}
            className="sport-filter"
          >
            {SPORTS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="page-content">
        <aside className="venues-sidebar">
          <VenuesList
            venues={venues}
            selectedVenueId={selectedVenueId}
            onVenueSelect={handleVenueSelect}
            loading={loading}
          />
        </aside>

        <main className="map-container">
          <SportsMapContainer
            venues={venues}
            center={mapCenter}
            zoom={12}
            selectedVenueId={selectedVenueId}
            onVenueSelect={handleVenueSelect}
            style={{ width: '100%', height: '100%' }}
          />
        </main>
      </div>
    </div>
  );
};