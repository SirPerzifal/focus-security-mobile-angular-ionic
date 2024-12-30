import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsWheelClampedPaymentPage } from './records-wheel-clamped-payment.page';

describe('RecordsWheelClampedPaymentPage', () => {
  let component: RecordsWheelClampedPaymentPage;
  let fixture: ComponentFixture<RecordsWheelClampedPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsWheelClampedPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
