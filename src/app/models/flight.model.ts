export interface FlightOffer {
    type: string;
    id: string;
    itineraries: Itinerary[];
    price: Price;
  }
  
  export interface Price {
    grandTotal: string;
    currency: string;
    total: string;
  }
  
  export interface Itinerary {
    segments: Segment[];
  }
  
  export interface Segment {
    departure: FlightEndPoint;
    arrival: FlightEndPoint;
    duration: string;
  }
  
  export interface FlightEndPoint {
    iataCode: string;
    at: any;
  }
  
  export interface FlightSearchResponse {
    data: FlightOffer[];
  }

  export interface FlightLocation {
    iataCode: string;
    name: string;
  }
