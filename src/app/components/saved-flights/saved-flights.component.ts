import { Component, OnInit } from '@angular/core';
import { FavoriteFlightsService } from '../../services/favorite-flights.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FlightOffer } from '../../models/flight.model';

@Component({
  selector: 'app-saved-flights',
  templateUrl: './saved-flights.component.html',
  styleUrl: './saved-flights.component.css'
})
export class SavedFlightsComponent implements OnInit {
  savedFlights: any[] = [];
  noSavedFlight: boolean = true;

  constructor(
    private favoriteFlightsService: FavoriteFlightsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSavedFlights();
  }

  async loadSavedFlights() {
    const user = await firstValueFrom(this.authService.getUser());
    
    if (user) {
      const flights = await firstValueFrom(this.favoriteFlightsService.getUserFavorites(user.uid));
      this.savedFlights = flights;
      this.noSavedFlight = this.savedFlights.length === 0;
    }
    console.log('Length: ', this.savedFlights.length);
  }

  async removeFlight(docId: string) {
    try {
      const user = await firstValueFrom(this.authService.getUser());
      if (user) {
        await this.favoriteFlightsService.removeFlight(docId);
        this.loadSavedFlights();
      }
    } catch (error) {
      console.error('Error removing flight:', error);
    }
  }

}
