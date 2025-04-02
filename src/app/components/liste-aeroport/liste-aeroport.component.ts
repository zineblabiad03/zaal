import { Component, OnInit } from '@angular/core';
import { AmadeusService } from '../../services/amadeus.service';
import { FavoriteFlightsService } from '../../services/favorite-flights.service';
import { AuthService } from '../../services/auth.service';
import { FlightLocation, FlightOffer } from '../../models/flight.model';
import { lastValueFrom, timeout  } from 'rxjs';

@Component({
  selector: 'app-liste-aeroport',
  templateUrl: './liste-aeroport.component.html',
  styleUrl: './liste-aeroport.component.css'
})
export class ListeAeroportComponent implements OnInit {
  userId: string = '';

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

  constructor(
    private flightLocationService: AmadeusService,
    private favoriteFlightsService: FavoriteFlightsService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.authService.getUser().subscribe((user) => {
      this.userId = user ? user.uid : '';
    });

    await this.loadFlightLocations();
  }

  async loadFlightLocations() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for(const letter of letters) {
      try {
        const intermediate_locations = await lastValueFrom(this.flightLocationService.searchAirports(letter, 5000));
        this.locations = [...this.locations, ...intermediate_locations];

        this.locations = this.locations.filter((location, index, self) =>
          index === self.findIndex(t => t.iataCode === location.iataCode)
        );

        console.log('Locations for ', letter, ': ', intermediate_locations.length);
        console.log('Total locations : ', this.locations.length);
      } catch (error) {
        console.log('Erreur de chargement des aéroports:', error);
      }
    }

    console.log('Total locations bis : ', this.locations.length);
  }

  async onSearchChange(type: 'departure' | 'arrival') {
    if (type === 'departure' && this.selectedDeparture.length > 0) {
      const lowerCasePattern = this.selectedDeparture.toLowerCase();
      this.flightLocationsDeparture = this.locations.filter(location =>
        location.iataCode.toLowerCase().startsWith(lowerCasePattern) || location.name.toLowerCase().startsWith(lowerCasePattern)
      );

      this.flightLocationsDeparture.sort((a, b) => a.iataCode.localeCompare(b.iataCode));
    } else if (type === 'arrival' && this.selectedArrival.length > 0) {
      const lowerCasePattern = this.selectedArrival.toLowerCase();
      this.flightLocationsArrival = this.locations.filter(location =>
        location.iataCode.toLowerCase().startsWith(lowerCasePattern) || location.name.toLowerCase().startsWith(lowerCasePattern)
      );

      this.flightLocationsArrival.sort((a, b) => a.iataCode.localeCompare(b.iataCode));
    } else {
      this.flightLocationsDeparture = [];
      this.flightLocationsArrival = [];
    }
  }

  async searchFlights() {
    this.flights = [];
    this.searchCompleted = false;
    this.messageRecherche = '';
    
    try {
      if (!this.selectedDeparture) {
        this.messageRecherche = 'Départ à renseigner !';
        return;
      }

      if (!this.selectedArrival) {
        this.messageRecherche = 'Arrivée à renseigner !';
        return;
      }

      if (!this.departureDate) {
        this.messageRecherche = 'Date de départ à renseigner !';
        return;
      }

      if (this.selectedDeparture == this.selectedArrival) {
        this.messageRecherche = 'Itinéraire non valide !';
        return;
      }

      const response = await lastValueFrom(this.flightLocationService.getFlights(this.selectedDeparture, this.selectedArrival, this.departureDate, this.returnDate, this.numberOfPassengers, !this.stopover)
      .pipe(timeout(5000)));
      this.flights = response.data;
          
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
  }

  resetSearch(): void {
    this.flights = [];
    this.searchCompleted = false;
  }

  async saveToFavorites(flight: FlightOffer) {
    if (this.userId.length == 0) {
      alert('You need to log in to save flights.');
      return;
    }

    try {
      await this.favoriteFlightsService.saveFlight(flight, this.userId);
      alert('Flight saved to favorites!');
    } catch (error) {
      console.error('Error saving flight:', error);
    }
  }

}
