import { Component } from '@angular/core';
import { AmadeusService } from '../../services/amadeus.service';
import { FlightOffer } from '../../models/flight.model';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent {
  flights: FlightOffer[] = [];
  origin = 'JFK';
  destination = 'LAX';
  departureDate = '2025-05-05';

  constructor(private amadeusService: AmadeusService) {}

  searchFlights() {
    this.amadeusService.getFlights(this.origin, this.destination, this.departureDate)
      .subscribe(response => {
        this.flights = response.data;
      }, error => {
        console.error('Error fetching flights:', error);
      });
  }
}
