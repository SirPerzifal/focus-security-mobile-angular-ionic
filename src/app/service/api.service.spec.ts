import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApiService } from './api.service';

/** Known backends used in this project (see api.service.ts comments). */
const LIVE_API = 'https://ifs360-sg.com';
const TEST_API = 'https://testing-ifs360.sgdemo.org';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose a known backend baseUrl (live or testing)', () => {
    expect([LIVE_API, TEST_API]).toContain(service.baseUrl);
  });

  it('reports whether current source points to live (informational)', () => {
    const isLive = service.baseUrl === LIVE_API;
    // eslint-disable-next-line no-console
    console.log(
      `[ApiService] baseUrl=${service.baseUrl} → ${isLive ? 'LIVE' : 'NOT LIVE (testing/other)'}`
    );
    expect(typeof service.baseUrl).toBe('string');
    expect(service.baseUrl.length).toBeGreaterThan(0);
  });
});
