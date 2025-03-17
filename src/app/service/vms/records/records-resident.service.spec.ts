import { TestBed } from '@angular/core/testing';

import { RecordsResidentService } from './records-resident.service';

describe('RecordsResidentService', () => {
  let service: RecordsResidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordsResidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
