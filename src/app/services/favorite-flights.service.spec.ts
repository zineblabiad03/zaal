import { TestBed } from '@angular/core/testing';

import { FavoriteFlightsService } from './favorite-flights.service';

describe('FavoriteFlightsService', () => {
  let service: FavoriteFlightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteFlightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
