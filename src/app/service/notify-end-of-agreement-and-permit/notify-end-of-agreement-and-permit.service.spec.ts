import { TestBed } from '@angular/core/testing';

import { NotifyEndOfAgreementAndPermitService } from './notify-end-of-agreement-and-permit.service';

describe('NotifyEndOfAgreementAndPermitService', () => {
  let service: NotifyEndOfAgreementAndPermitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyEndOfAgreementAndPermitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
