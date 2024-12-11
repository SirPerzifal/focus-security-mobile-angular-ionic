import { TestBed } from '@angular/core/testing';

import { FacilityBookingsService } from './facility-bookings.service';

describe('FacilityBookingsService', () => {
  let service: FacilityBookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityBookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
