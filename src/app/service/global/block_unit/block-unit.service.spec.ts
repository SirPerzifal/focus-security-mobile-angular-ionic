import { TestBed } from '@angular/core/testing';

import { BlockUnitService } from './block-unit.service';

describe('BlockUnitService', () => {
  let service: BlockUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
