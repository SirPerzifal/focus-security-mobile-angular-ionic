import { TestBed } from '@angular/core/testing';

import { MoveFormService } from './move-form.service';

describe('MoveFormService', () => {
  let service: MoveFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
