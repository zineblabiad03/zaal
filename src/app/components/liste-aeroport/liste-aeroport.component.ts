import { Component, OnInit } from '@angular/core';
import { AmadeusService } from '../../services/amadeus.service';
import { FlightLocation, FlightOffer, FlightSearchResponse } from '../../models/flight.model';
import { lastValueFrom } from 'rxjs';

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
      const lowerCasePattern = this.selectedDeparture.toLowerCase();
      this.flightLocationsDeparture = this.locations.filter(location =>
        location.iataCode.toLowerCase().startsWith(lowerCasePattern)
      );

      this.flightLocationsDeparture.sort((a, b) => a.iataCode.localeCompare(b.iataCode));
    } else if (type === 'arrival' && this.selectedArrival.length > 0) {
      const lowerCasePattern = this.selectedArrival.toLowerCase();
      this.flightLocationsArrival = this.locations.filter(location =>
        location.iataCode.toLowerCase().startsWith(lowerCasePattern)
      );

      this.flightLocationsArrival.sort((a, b) => a.iataCode.localeCompare(b.iataCode));
    } else {
      this.flightLocationsDeparture = [];
      this.flightLocationsArrival = [];
    }
  }

  async loadFlightLocations() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for(const letter of letters) {
      try {
        const intermediate_locations = await lastValueFrom(this.flightLocationService.searchAirports(letter, 1000));
        this.locations = [...this.locations, ...intermediate_locations];

        console.log('Locations for ', letter, ': ', intermediate_locations.length);
        console.log('Total locations : ', this.locations.length);
      } catch (error) {
        console.log('Erreur de chargement des aéroports:', error);
      }
    }

    this.locations = this.locations.filter((location, index, self) =>
      index === self.findIndex(t => t.iataCode === location.iataCode)
    );
    console.log('Total locations bis : ', this.locations.length);
  }

  async searchFlights() {
    this.flights = [];
    this.searchCompleted = false;
    
    try {
      const response = await lastValueFrom(this.flightLocationService.getFlights(this.selectedDeparture, this.selectedArrival, this.departureDate, this.returnDate, this.numberOfPassengers, !this.stopover));
      this.flights = response.data;

      console.log('Flights :');
      console.log(this.flights);
          
      this.searchCompleted = this.flights.length > 0;

      if (this.flights.length === 0) {
        this.messageRecherche = 'Aucun vol trouvé !';
        console.log('No flights found.');
      } else {
        this.messageRecherche = '';
        console.log('All flights: ', this.flights);
      }
    } catch (error) {
      this.messageRecherche = 'Aucun vol trouvé !';
      console.error('Error fetching flights:', error);
    }

      // this.flightLocationService.getFlights(this.selectedDeparture, this.selectedArrival, this.departureDate, this.returnDate, this.numberOfPassengers, !this.stopover).subscribe({
      // next: (response: FlightSearchResponse) => {
      //     this.flights = [...this.flights, ...response.data];
      //       // .filter(flight =>
      //       //   flight.itineraries.every(itinerary => itinerary.segments.length <= 2)
      //       // );
      //     console.log(response.data);
          
      //     this.searchCompleted = this.flights.length > 0;

      //     if (this.flights.length === 0) {
      //       this.messageRecherche = 'Aucun vol trouvé !';
      //       console.log('No flights found.');
      //     } else {
      //       this.messageRecherche = '';
      //       console.log('All flights: ', this.flights);
      //     }
          
      // },
      // error: (error) => {
      //   this.messageRecherche = 'Aucun vol trouvé !';
      //   console.error('Error fetching flights:', error);
      // }
    // });
  }

  resetSearch(): void {
    this.flights = [];
    this.searchCompleted = false;
  }


}
