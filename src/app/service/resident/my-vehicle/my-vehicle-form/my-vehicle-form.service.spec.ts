import { TestBed } from '@angular/core/testing';

import { MyVehicleFormService } from './my-vehicle-form.service';

describe('MyVehicleFormService', () => {
  let service: MyVehicleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyVehicleFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
