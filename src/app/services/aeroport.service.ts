import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private apiUrl = 'https://api.aviationstack.com/v1/airports';
  private apiKey = '91f775c75a662d44663375a790cbb63e'; 

  constructor(private http: HttpClient) {}

  getAllAirports() : Promise<{code: string, name: string, type : string}[]> {
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });
    const params = new HttpParams()
      .set('access_key', this.apiKey)
      .set('fields', 'iata_code,airport_name,airport_type');

    return this.http.get<{code: string, name: string, type : string}[]>(this.apiUrl, {headers, params});
  }
}