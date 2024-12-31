import { TestBed } from '@angular/core/testing';

import { RaiseARequestService } from './raise-a-request.service';

describe('RaiseARequestService', () => {
  let service: RaiseARequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaiseARequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
