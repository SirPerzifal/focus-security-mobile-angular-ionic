import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentPaymentPage } from './resident-payment.page';

describe('ResidentPaymentPage', () => {
  let component: ResidentPaymentPage;
  let fixture: ComponentFixture<ResidentPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
