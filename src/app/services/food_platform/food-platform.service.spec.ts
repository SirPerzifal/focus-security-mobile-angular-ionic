import { TestBed } from '@angular/core/testing';

import { FoodPlatformService } from './food-platform.service';

describe('FoodPlatformService', () => {
  let service: FoodPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
