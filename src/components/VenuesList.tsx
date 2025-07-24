import React from 'react';
import { SportsVenue } from './maps';
import './VenuesList.css';

interface VenuesListProps {
  venues: SportsVenue[];
  selectedVenueId?: string | null;
  onVenueSelect: (venue: SportsVenue) => void;
  loading?: boolean;
}

export const VenuesList: React.FC<VenuesListProps> = ({
  venues,
  selectedVenueId,
  onVenueSelect,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="venues-list loading">
        <div className="loading-spinner">Loading venues...</div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="venues-list empty">
        <p>No venues found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="venues-list">
      <h3 className="venues-list-title">
        Sports Venues ({venues.length})
      </h3>
      <div className="venues-list-items">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            isSelected={venue.id === selectedVenueId}
            onClick={() => onVenueSelect(venue)}
          />
        ))}
      </div>
    </div>
  );
};

interface VenueCardProps {
  venue: SportsVenue;
  isSelected: boolean;
  onClick: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, isSelected, onClick }) => {
  return (
    <div 
      className={`venue-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {venue.imageUrl && (
        <img 
          src={venue.imageUrl} 
          alt={venue.name}
          className="venue-card-image"
        />
      )}
      <div className="venue-card-content">
        <h4 className="venue-card-name">{venue.name}</h4>
        <p className="venue-card-sport">{venue.sport.toUpperCase()}</p>
        <p className="venue-card-address">{venue.address}</p>
        
        <div className="venue-card-details">
          {venue.rating && (
            <span className="venue-card-rating">
              ⭐ {venue.rating}
            </span>
          )}
          {venue.capacity && (
            <span className="venue-card-capacity">
              👥 {venue.capacity.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};