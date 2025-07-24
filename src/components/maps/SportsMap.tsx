import React, { useState, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  Pin
} from '@vis.gl/react-google-maps';

export interface SportsVenue {
  id: string;
  name: string;
  sport: string;
  address: string;
  position: google.maps.LatLngLiteral;
  rating?: number;
  capacity?: number;
  imageUrl?: string;
  amenities?: string[];
}

interface SportsMapProps {
  venues: SportsVenue[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onVenueSelect?: (venue: SportsVenue | null) => void;
  selectedVenueId?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

const SPORT_COLORS = {
  football: '#FF6B35',
  basketball: '#F7931E',
  baseball: '#4A90E2',
  soccer: '#7ED321',
  tennis: '#9013FE',
  hockey: '#50E3C2',
  default: '#8E8E93'
};

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City
const DEFAULT_ZOOM = 12;

export const SportsMap: React.FC<SportsMapProps> = ({
  venues,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onVenueSelect,
  selectedVenueId,
  className,
  style
}) => {
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);

  const handleMarkerClick = useCallback((venue: SportsVenue) => {
    onVenueSelect?.(venue);
  }, [onVenueSelect]);

  const handleMapClick = useCallback(() => {
    onVenueSelect?.(null);
  }, [onVenueSelect]);

  const selectedVenue = useMemo(() => 
    venues.find(venue => venue.id === selectedVenueId) || null,
    [venues, selectedVenueId]
  );

  return (
    <div className={className} style={style}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="sports-venues-map"
        gestureHandling="greedy"
        disableDefaultUI={false}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
      >
        {venues.map((venue) => (
          <VenueMarker
            key={venue.id}
            venue={venue}
            isSelected={venue.id === selectedVenueId}
            isHovered={venue.id === hoveredVenueId}
            onClick={handleMarkerClick}
            onMouseEnter={() => setHoveredVenueId(venue.id)}
            onMouseLeave={() => setHoveredVenueId(null)}
          />
        ))}

        {selectedVenue && (
          <VenueInfoWindow
            venue={selectedVenue}
            onClose={() => onVenueSelect?.(null)}
          />
        )}
      </Map>
    </div>
  );
};

interface VenueMarkerProps {
  venue: SportsVenue;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (venue: SportsVenue) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const VenueMarker: React.FC<VenueMarkerProps> = ({
  venue,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const sportColor = SPORT_COLORS[venue.sport as keyof typeof SPORT_COLORS] || SPORT_COLORS.default;

  const scale = isSelected ? 1.4 : isHovered ? 1.2 : 1;

  return (
    <AdvancedMarker
      ref={markerRef}
      position={venue.position}
      onClick={() => onClick(venue)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.2s ease-in-out',
        transformOrigin: 'bottom center'
      }}
    >
      <Pin
        background={sportColor}
        borderColor={isSelected ? '#FFFFFF' : sportColor}
        glyphColor="#FFFFFF"
        scale={1.2}
      >
        {getSportIcon(venue.sport)}
      </Pin>
    </AdvancedMarker>
  );
};

interface VenueInfoWindowProps {
  venue: SportsVenue;
  onClose: () => void;
}

const VenueInfoWindow: React.FC<VenueInfoWindowProps> = ({ venue, onClose }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker ref={markerRef} position={venue.position} />
      <InfoWindow
        anchor={marker}
        onCloseClick={onClose}
        maxWidth={300}
        className="sports-venue-info"
      >
        <div className="venue-info-content">
          {venue.imageUrl && (
            <img 
              src={venue.imageUrl} 
              alt={venue.name}
              className="venue-image"
            />
          )}
          <div className="venue-details">
            <h3 className="venue-name">{venue.name}</h3>
            <p className="venue-sport">{venue.sport.toUpperCase()}</p>
            <p className="venue-address">{venue.address}</p>
            
            {venue.rating && (
              <div className="venue-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(venue.rating))}
                  {'☆'.repeat(5 - Math.floor(venue.rating))}
                </span>
                <span className="rating-value">{venue.rating}/5</span>
              </div>
            )}
            
            {venue.capacity && (
              <p className="venue-capacity">Capacity: {venue.capacity.toLocaleString()}</p>
            )}
            
            {venue.amenities && venue.amenities.length > 0 && (
              <div className="venue-amenities">
                <strong>Amenities:</strong>
                <ul>
                  {venue.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </InfoWindow>
    </>
  );
};

function getSportIcon(sport: string): string {
  const icons: Record<string, string> = {
    football: '🏈',
    basketball: '🏀',
    baseball: '⚾',
    soccer: '⚽',
    tennis: '🎾',
    hockey: '🏒',
    golf: '⛳',
    swimming: '🏊',
    track: '🏃',
    default: '🏟️'
  };
  
  return icons[sport] || icons.default;
}