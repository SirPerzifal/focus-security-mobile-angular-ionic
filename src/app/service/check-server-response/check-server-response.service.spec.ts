import { TestBed } from '@angular/core/testing';

import { CheckServerResponseService } from './check-server-response.service';

describe('CheckServerResponseService', () => {
  let service: CheckServerResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckServerResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
