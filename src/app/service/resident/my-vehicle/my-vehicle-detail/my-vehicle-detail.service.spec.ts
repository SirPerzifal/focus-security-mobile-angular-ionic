import { TestBed } from '@angular/core/testing';

import { MyVehicleDetailService } from './my-vehicle-detail.service';

describe('MyVehicleDetailService', () => {
  let service: MyVehicleDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyVehicleDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
