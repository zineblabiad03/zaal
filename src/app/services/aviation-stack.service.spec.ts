import { TestBed } from '@angular/core/testing';

import { AviationStackService } from './aviation-stack.service';

describe('AviationStackService', () => {
  let service: AviationStackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AviationStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
