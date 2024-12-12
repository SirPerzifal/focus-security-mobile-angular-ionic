import { TestBed } from '@angular/core/testing';

import { HiredCarService } from './hired-car.service';

describe('HiredCarService', () => {
  let service: HiredCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiredCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
