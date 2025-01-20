import { TestBed } from '@angular/core/testing';

import { EmergencyVehicleService } from './emergency.vehicle.service';

describe('EmergencyVehicleService', () => {
  let service: EmergencyVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
