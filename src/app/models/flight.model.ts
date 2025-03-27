export interface FlightOffer {
    type: string;
    id: string;
    source: string;
    price: Price;
    itineraries: Itinerary[];
  }
  
  export interface Price {
    currency: string;
    total: string;
  }
  
  export interface Itinerary {
    segments: Segment[];
  }
  
  export interface Segment {
    departure: AirportDetails;
    arrival: AirportDetails;
    duration: string;
  }
  
  export interface AirportDetails {
    iataCode: string;
    at: string;
  }
  
  export interface FlightSearchResponse {
    data: FlightOffer[];
  }

  export interface FlightLocation {
    iataCode: string;
    name: string;
  }
