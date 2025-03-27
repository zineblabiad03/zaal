import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FlightLocation } from '../models/flight.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private apiUrl = 'https://api.api-ninjas.com/v1/airports?name=';
  private apiKey = 'Cph+MAxQF8i2zDQ9erVKLw==jYTG0KUjvsbpZZVj';

  constructor(private http: HttpClient) {}

  getAllAirports() : Promise<{ data: FlightLocation[] }> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });

    return lastValueFrom(this.http.get<{ data: FlightLocation[] }>(this.apiUrl, { headers }));
    // const params = new HttpParams()
    //   .set('access_key', this.apiKey)
    //   .set('fields', 'iata_code,airport_name');

    // return lastValueFrom(this.http.get<{ data: FlightLocation[] }>(this.apiUrl, {params}));
  }
}