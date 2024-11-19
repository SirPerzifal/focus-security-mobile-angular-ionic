import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityBookingPaymentPage } from './facility-booking-payment.page';

describe('FacilityBookingPaymentPage', () => {
  let component: FacilityBookingPaymentPage;
  let fixture: ComponentFixture<FacilityBookingPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBookingPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
