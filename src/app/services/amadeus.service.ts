import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observer, Observable } from 'rxjs';
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

  public getAllAirports() : Observable<FlightLocation[]> {
    return new Observable((observer: Observer<FlightLocation[]>) => {
      const letters = 'A'.split('');
      let allLocations: FlightLocation[] = [];
      let currentIndex = 0;

      const processNext = () => {
        if (currentIndex >= letters.length) {
          // const uniqueLocations = allLocations.filter((location, index, self) =>
          //   index === self.findIndex(t => t.iata_code === location.iata_code)
          // );
          // observer.next(uniqueLocations);
          observer.next(allLocations);
          observer.complete();
          return;
        }

        this.searchAirports(letters[currentIndex]).subscribe({
          next: (locations: FlightLocation[]) => {
            allLocations = allLocations.concat(locations);
            currentIndex++;
            setTimeout(processNext, 500);
          },
          error: err => observer.error(err)
        });
      };

      processNext();
    });
  }

}
