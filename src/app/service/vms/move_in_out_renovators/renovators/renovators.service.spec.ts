import { TestBed } from '@angular/core/testing';

import { RenovatorsService } from './renovators.service';

describe('RenovatorsService', () => {
  let service: RenovatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenovatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
