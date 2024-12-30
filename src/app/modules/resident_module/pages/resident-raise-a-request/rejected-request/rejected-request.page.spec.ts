import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectedRequestPage } from './rejected-request.page';

describe('RejectedRequestPage', () => {
  let component: RejectedRequestPage;
  let fixture: ComponentFixture<RejectedRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
