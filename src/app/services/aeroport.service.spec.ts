import { TestBed } from '@angular/core/testing';

import { AirportService } from './aeroport.service';

describe('AeroportService', () => {
  let service: AirportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
