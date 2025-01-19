import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmadeusService {
  private authUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  private baseUrl = 'https://test.api.amadeus.com/v2';
  private clientId = 'lT44pa1GsQA29UbtNYn2V1EfJRgd01wF';
  private clientSecret = 'Uhe4TA5GRT6puIJN';
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  getAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    }).toString();

    return this.http.post(this.authUrl, body, { headers });
  }

  fetchFlightOffers(origin: string, destination: string, date: string): Observable<any> {
    if (!this.token) {
      throw new Error('Token is not set. Call getAccessToken() first.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const url = `${this.baseUrl}/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1`;

    return this.http.get(url, { headers });
  }

  setToken(token: string): void {
    this.token = token;
  }
}
