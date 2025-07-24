import { useState, useEffect } from 'react';
import { SportsVenue } from '../components/maps';

// Mock data for demonstration - replace with your actual data source
const MOCK_VENUES: SportsVenue[] = [
  {
    id: '1',
    name: 'Madison Square Garden',
    sport: 'basketball',
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    position: { lat: 40.7505, lng: -73.9934 },
    rating: 4.5,
    capacity: 20789,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
    amenities: ['Parking', 'Concessions', 'Gift Shop', 'Accessibility']
  },
  {
    id: '2',
    name: 'Yankee Stadium',
    sport: 'baseball',
    address: '1 E 161st St, Bronx, NY 10451',
    position: { lat: 40.8296, lng: -73.9262 },
    rating: 4.7,
    capacity: 47309,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
    amenities: ['Parking', 'Museum', 'Tours', 'Restaurants']
  },
  {
    id: '3',
    name: 'MetLife Stadium',
    sport: 'football',
    address: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
    position: { lat: 40.8135, lng: -74.0745 },
    rating: 4.3,
    capacity: 82500,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
    amenities: ['Parking', 'Concessions', 'Pro Shop', 'Club Seats']
  },
  {
    id: '4',
    name: 'Arthur Ashe Stadium',
    sport: 'tennis',
    address: 'Flushing Meadows Corona Park, Queens, NY 11368',
    position: { lat: 40.7501, lng: -73.8448 },
    rating: 4.6,
    capacity: 23771,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
    amenities: ['Parking', 'Food Courts', 'Pro Shop', 'Practice Courts']
  },
  {
    id: '5',
    name: 'Red Bull Arena',
    sport: 'soccer',
    address: '600 Cape May St, Harrison, NJ 07029',
    position: { lat: 40.7369, lng: -74.1503 },
    rating: 4.4,
    capacity: 25000,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
    amenities: ['Parking', 'Fan Shop', 'Restaurants', 'Kids Zone']
  }
];

export interface UseSportsVenuesOptions {
  sport?: string;
  location?: google.maps.LatLngLiteral;
  radius?: number; // in meters
}

export function useSportsVenues(options: UseSportsVenuesOptions = {}) {
  const [venues, setVenues] = useState<SportsVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredVenues = MOCK_VENUES;

        // Filter by sport if specified
        if (options.sport) {
          filteredVenues = filteredVenues.filter(
            venue => venue.sport.toLowerCase() === options.sport?.toLowerCase()
          );
        }

        // Filter by location and radius if specified
        if (options.location && options.radius) {
          filteredVenues = filteredVenues.filter(venue => {
            const distance = calculateDistance(
              options.location!,
              venue.position
            );
            return distance <= options.radius!;
          });
        }

        setVenues(filteredVenues);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [options.sport, options.location, options.radius]);

  return { venues, loading, error };
}

// Helper function to calculate distance between two points
function calculateDistance(
  point1: google.maps.LatLngLiteral,
  point2: google.maps.LatLngLiteral
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}