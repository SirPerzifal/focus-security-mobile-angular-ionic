import { TestBed } from '@angular/core/testing';

import { CheckAppVersionService } from './check-app-version.service';

describe('CheckAppVersionService', () => {
  let service: CheckAppVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckAppVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
