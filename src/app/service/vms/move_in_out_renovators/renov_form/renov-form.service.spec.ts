import { TestBed } from '@angular/core/testing';

import { RenovFormService } from './renov-form.service';

describe('RenovFormService', () => {
  let service: RenovFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenovFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
