import { TestBed } from '@angular/core/testing';

import { HouseRulesService } from './house-rules.service';

describe('HouseRulesService', () => {
  let service: HouseRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
