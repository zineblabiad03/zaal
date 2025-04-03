import { Component, OnInit } from '@angular/core';
import { FavoriteFlightsService } from '../../services/favorite-flights.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-saved-flights',
  templateUrl: './saved-flights.component.html',
  styleUrl: './saved-flights.component.css'
})
export class SavedFlightsComponent implements OnInit {
  savedFlights: any[] = [];
  noSavedFlight: boolean = true;

  loading: boolean = true;

  constructor(
    private favoriteFlightsService: FavoriteFlightsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loadSavedFlights();
    this.loading = false;
  }

  async loadSavedFlights() {
    for (let i = 0; i < 10000000000; i++) {}
    const user = await firstValueFrom(this.authService.getUser());
    
    if (user) {
      const flights = await firstValueFrom(this.favoriteFlightsService.getUserFavorites(user.uid));
      this.savedFlights = flights;
      this.noSavedFlight = this.savedFlights.length === 0;
    }
    console.log('Length: ', this.savedFlights.length);
  }

  async removeFlight(docId: string) {
    this.loading = true;
    try {
      const user = await firstValueFrom(this.authService.getUser());
      if (user) {
        await this.favoriteFlightsService.removeFlight(docId);
        this.loadSavedFlights();
      }
    } catch (error) {
      console.error('Error removing flight:', error);
    }
    this.loading = false;
  }

}
