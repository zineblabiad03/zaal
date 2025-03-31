import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FlightLocation } from '../models/flight.model';
import { FlightSearchResponse } from '../models/flight.model';


@Injectable({
  providedIn: 'root'
})
export class AmadeusService {
  private authUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  private airportURL = 'https://test.api.amadeus.com/v1/reference-data/locations';
  private flightUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
  private clientId = 'I8SZq9mAGhLT3YB3zqLZhyJg37JqaC8S';
  private clientSecret = 'eyV6FoJepGh9f1fC';
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

  public getFlights(origin: string, destination: string, departureDate: string, returnDate: string, adults: number, nonStop: boolean): Observable<FlightSearchResponse> {
    return new Observable(observer => {
      if (!this.accessToken) {
        this.getAccessToken().subscribe(authData => {
          this.accessToken = authData.access_token;
          this.fetchFlights(origin, destination, departureDate, returnDate, adults, nonStop).subscribe(data => {
            observer.next(data);
            observer.complete();
          });
        });
      } else {
          this.fetchFlights(origin, destination, departureDate, returnDate, adults, nonStop).subscribe(data => {
          observer.next(data);
          observer.complete();
        });
      }
    });
  }

  private fetchFlights(origin: string, destination: string, departureDate: string, returnDate: string, adults: number, nonStop: boolean): Observable<FlightSearchResponse> {
    const datePipe = new DatePipe('en-US');
    
    departureDate = datePipe.transform(departureDate, 'yyyy-MM-dd') || departureDate;
    returnDate = datePipe.transform(returnDate, 'yyyy-MM-dd') || returnDate;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.accessToken}` });

    let params = new HttpParams()
      .set('originLocationCode', origin.toUpperCase())
      .set('destinationLocationCode', destination.toUpperCase())
      .set('departureDate', departureDate)
      .set('adults', adults)
      .set('nonStop', nonStop);
    
    if (returnDate.length > 0) {
      params = new HttpParams()
      .set('originLocationCode', origin.toUpperCase())
      .set('destinationLocationCode', destination.toUpperCase())
      .set('departureDate', departureDate)
      .set('returnDate', returnDate)
      .set('adults', adults)
      .set('nonStop', nonStop);
    }

    return this.http.get<FlightSearchResponse>(this.flightUrl, { headers, params });
  }

  public searchAirports(keyword: string, limit: number = 100) : Observable<FlightLocation[]> {
    return new Observable(observer => {
      this.getAccessToken().subscribe({
        next: tokenResponse => {
          const token = tokenResponse.access_token;

          const params = new HttpParams()
            .set('keyword', keyword)
            .set('subType', 'AIRPORT')
            .set('page[limit]', limit.toString());

          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });

          this.http.get<{ data: FlightLocation[] }>(this.airportURL, { headers, params }).subscribe({
            next: response  => {
              observer.next(response.data || []);
              observer.complete();
            },
            error: err => {
              observer.error(err);
            }
          });
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

}
