import { TestBed } from '@angular/core/testing';

import { NoticeAndDocService } from './notice-and-doc.service';

describe('NoticeAndDocService', () => {
  let service: NoticeAndDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticeAndDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
