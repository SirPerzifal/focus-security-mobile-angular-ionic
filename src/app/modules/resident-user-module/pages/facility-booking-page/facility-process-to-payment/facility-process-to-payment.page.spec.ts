import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityProcessToPaymentPage } from './facility-process-to-payment.page';

describe('FacilityProcessToPaymentPage', () => {
  let component: FacilityProcessToPaymentPage;
  let fixture: ComponentFixture<FacilityProcessToPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityProcessToPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
