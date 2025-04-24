import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiseARequestHistoryPage } from './raise-a-request-history.page';

describe('RaiseARequestHistoryPage', () => {
  let component: RaiseARequestHistoryPage;
  let fixture: ComponentFixture<RaiseARequestHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseARequestHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
