import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private apiUrl = 'https://test.api.amadeus.com/v1/reference-data/locations';
  private apiKey = 'lT44pa1GsQA29UbtNYn2V1EfJRgd01wF'; 

  constructor(private http: HttpClient) {}

  getAllAirports(searchTerm: string) {
    let allAirports: { code: string; name: string }[] = [];
    let page = 1;

    const fetchPage = (): Promise<{ code: string; name: string }[]> => {
      return this.http.get<any>(this.apiUrl, {
        params: {
          subType: 'AIRPORT',
          keyword: searchTerm,
          page: page.toString(),
          apikey: this.apiKey,
        },
      }).toPromise()
        .then(response => {
          const airports = response.data.map((airport: any) => ({
            code: airport.iataCode,
            name: airport.name,
          }));

          if (airports.length > 0) {
            allAirports = [...allAirports, ...airports];
            page++;
            return fetchPage(); 
          } else {
            return allAirports; 
          }
        })
        .catch(error => {
          console.error('Error fetching airports:', error);
          return allAirports;
        });
    };

    return fetchPage();
  }
}
