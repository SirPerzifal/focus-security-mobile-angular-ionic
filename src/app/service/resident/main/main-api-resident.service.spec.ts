import { TestBed } from '@angular/core/testing';

import { MainApiResidentService } from './main-api-resident.service';

describe('MainApiResidentService', () => {
  let service: MainApiResidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainApiResidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
