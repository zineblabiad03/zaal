import { Component, OnInit } from '@angular/core';
import { FavoriteFlightsService } from '../../services/favorite-flights.service';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-saved-flights',
  templateUrl: './saved-flights.component.html',
})
export class SavedFlightsComponent implements OnInit {
  savedFlights: any[] = [];
  noSavedFlight: boolean = false;
  userId: string = '';

  constructor(
    private favoriteFlightsService: FavoriteFlightsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadSavedFlights();
        // if (this.savedFlights.length > 0) {
        //   this.noSavedFlight = false;
        // }
      }
    });
    console.log('Length: ', this.savedFlights.length);
  }

  loadSavedFlights() {
    if (!this.userId) return;

    this.favoriteFlightsService.getUserFavorites(this.userId).subscribe((flights) => {
      this.savedFlights = flights;
    });
  }

  async removeFlight(docId: string) {
    try {
      await this.favoriteFlightsService.removeFlight(docId);
      alert('Flight removed from favorites!');
    } catch (error) {
      console.error('Error removing flight:', error);
    }
  }

}
