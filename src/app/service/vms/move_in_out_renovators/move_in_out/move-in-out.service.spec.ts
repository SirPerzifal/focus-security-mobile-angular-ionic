import { TestBed } from '@angular/core/testing';

import { MoveInOutService } from './move-in-out.service';

describe('MoveInOutService', () => {
  let service: MoveInOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveInOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
