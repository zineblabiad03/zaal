import { Component, OnInit } from '@angular/core';
import { AmadeusService } from './amadeus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'zaal';
  flightOffers: any[] = [];

  constructor(private amadeusService: AmadeusService) {}

  ngOnInit(): void {
    this.amadeusService.getAccessToken().subscribe({
      next: (response) => {
        console.log('Access Token:', response.access_token);
        this.amadeusService.setToken(response.access_token);

        this.amadeusService
          .fetchFlightOffers('NYC', 'LAX', '2025-02-01')
          .subscribe({
            next: (data) => {
              console.log('Flight Offers:', data);
              this.flightOffers = data.data;
            },
            error: (error) => console.error('Error fetching flight offers:', error)
          });
      },
      error: (error) => console.error('Error retrieving access token:', error)
    });
  }
}
