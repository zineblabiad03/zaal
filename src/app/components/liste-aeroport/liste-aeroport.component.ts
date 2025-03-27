import { Component, OnInit } from '@angular/core';
import { AmadeusService } from '../../services/amadeus.service';
import { FlightLocation, FlightOffer } from '../../models/flight.model';

@Component({
  selector: 'app-liste-aeroport',
  templateUrl: './liste-aeroport.component.html',
  styleUrl: './liste-aeroport.component.css'
})
export class ListeAeroportComponent implements OnInit {
  locations: FlightLocation[] = [];

  flightLocationsDeparture: FlightLocation[] = [];
  flightLocationsArrival: FlightLocation[] = [];

  flights: FlightOffer[] = [];

  selectedDeparture: string = '';
  selectedArrival: string = '';
  
  departureDate: string = '';
  returnDate: string = '';

  numberOfPassengers: number = 1 ;
  stopover: boolean = false;
  
  searchCompleted: boolean = false;

  messageRecherche: string = '';

  constructor(private flightLocationService: AmadeusService) {}

  async ngOnInit(): Promise<void> {
    await this.loadFlightLocations();
  }

  async onSearchChange(type: 'departure' | 'arrival') {
    if (type === 'departure' && this.selectedDeparture.length > 0) {
      if (this.locations.some(location => location.iataCode.toLowerCase() === this.selectedDeparture.toLowerCase())) {
        this.flightLocationsDeparture = [];
      } else {
        const lowerCasePattern = this.selectedDeparture.toLowerCase();
        this.flightLocationsDeparture = this.locations.filter(location =>
          location.iataCode.toLowerCase().startsWith(lowerCasePattern)
        );

        this.flightLocationsDeparture.sort((a, b) => a.iataCode.localeCompare(b.iataCode));

        this.flightLocationsDeparture = this.flightLocationsDeparture.filter((location, index, self) =>
          index === self.findIndex(t => t.name === location.name)
        );
      }
    } else if (type === 'arrival' && this.selectedArrival.length > 0) {
      if (this.locations.some(location => location.iataCode.toLowerCase() === this.selectedArrival.toLowerCase())) {
        this.flightLocationsArrival = [];
      } else {
        const lowerCasePattern = this.selectedArrival.toLowerCase();
        this.flightLocationsArrival = this.locations.filter(location =>
          location.iataCode.toLowerCase().startsWith(lowerCasePattern)
        );

        this.flightLocationsArrival.sort((a, b) => a.iataCode.localeCompare(b.iataCode));

        this.flightLocationsArrival = this.flightLocationsArrival.filter((location, index, self) =>
          index === self.findIndex(t => t.name === location.name)
        );
      }
    } else {
      this.flightLocationsDeparture = [];
      this.flightLocationsArrival = [];
    }
  }

  async loadFlightLocations() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for(const letter of letters) {
      await new Promise(resolve => setTimeout(resolve, 100));

      this.flightLocationService.searchAirports(letter, 1000).subscribe({
        next: (data: FlightLocation[]) => {
          console.log(`Results for '${letter}':`, data);
          this.locations = [...this.locations, ...data];
        },
        error: (error: any) => {
          console.error('Erreur de chargement des aéroports:', error);
        }
      });
    }
  }

  searchFlights(): void {
    this.flights = [];
    this.searchCompleted = false;

    this.flightLocationService.getFlights(this.selectedDeparture, this.selectedArrival, this.departureDate, this.returnDate, this.numberOfPassengers, !this.stopover).subscribe({
      next: (response) => {
          this.flights = (response.data)
            .filter(flight =>
              flight.itineraries.every(itinerary => itinerary.segments.length <= 2)
            );
          
          this.searchCompleted = this.flights.length > 0;

          if (this.flights.length === 0) {
            this.messageRecherche = 'Aucun vol trouvé !';
            console.log('No flights found.');
          } else {
            this.messageRecherche = '';
            console.log('All flights: ', this.flights);
          }
          
      },
      error: (error) => {
        this.messageRecherche = 'Aucun vol trouvé !';
        console.error('Error fetching flights:', error);
      }
    });
  }

  resetSearch(): void {
    this.flights = [];
    this.searchCompleted = false;
  }


}
