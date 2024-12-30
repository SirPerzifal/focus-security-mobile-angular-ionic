import { TestBed } from '@angular/core/testing';

import { OffensesService } from './offenses.service';

describe('OffensesService', () => {
  let service: OffensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
