import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightSearchResponse } from '../models/flight.model';


@Injectable({
  providedIn: 'root'
})
export class AmadeusService {
  private authUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  private flightUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
  private clientId = 'lT44pa1GsQA29UbtNYn2V1EfJRgd01wF';
  private clientSecret = 'Uhe4TA5GRT6puIJN';
  private accessToken: string | null = null;

  constructor(private http: HttpClient) { }

  private getAccessToken(): Observable<{ access_token: string }> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<{ access_token: string }>(this.authUrl, body.toString(), { headers });
  }

  public getFlights(origin: string, destination: string, departureDate: string): Observable<FlightSearchResponse> {
    return new Observable(observer => {
      if (!this.accessToken) {
        this.getAccessToken().subscribe(authData => {
          this.accessToken = authData.access_token;
          this.fetchFlights(origin, destination, departureDate).subscribe(data => {
            observer.next(data);
            observer.complete();
          });
        });
      } else {
        this.fetchFlights(origin, destination, departureDate).subscribe(data => {
          observer.next(data);
          observer.complete();
        });
      }
    });
  }

  private fetchFlights(origin: string, destination: string, departureDate: string): Observable<FlightSearchResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.accessToken}` });

    const params = new HttpParams()
      .set('originLocationCode', origin)
      .set('destinationLocationCode', destination)
      .set('departureDate', departureDate)
      .set('adults', '1');

    return this.http.get<FlightSearchResponse>(this.flightUrl, { headers, params });
  }
}
