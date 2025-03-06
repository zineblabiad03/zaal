import { Component, OnInit } from '@angular/core';
import { AirportService } from '../../services/aeroport.service';

@Component({
  selector: 'app-liste-aeroport',
  templateUrl: './liste-aeroport.component.html',
  styleUrl: './liste-aeroport.component.css'
})
export class ListeAeroportComponent implements OnInit {
  flightLocations: {code: string; name: string; type: string}[] = [];
  selectedLocation = '';
  isLoading = false;
  errorMessage = '';

  constructor(private flightLocationService: AirportService) {}
  
  ngOnInit() {
    this.loadFlightLocations();
  }

  loadFlightLocations() {
    this.isLoading = true;
    this.errorMessage = '';

    this.flightLocationService.getAllAirports()
      .then(result => {
        this.flightLocations = result;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Erreur de récupération des aéroports:', error);
        this.errorMessage = "Erreur de chargement des aéroports.";
        this.isLoading = false;
      })
  }
}