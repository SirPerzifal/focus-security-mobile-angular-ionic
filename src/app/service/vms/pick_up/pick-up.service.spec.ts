import { TestBed } from '@angular/core/testing';

import { VmsServicePickUp } from './pick-up.service';

describe('PickUpService', () => {
  let service: VmsServicePickUp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VmsServicePickUp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
