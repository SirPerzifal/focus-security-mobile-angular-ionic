import { TestBed } from '@angular/core/testing';

import { MyVehicleService } from './my-vehicle.service';

describe('MyVehicleService', () => {
  let service: MyVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
