import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFormVehiclePage } from './payment-form-vehicle.page';

describe('PaymentFormVehiclePage', () => {
  let component: PaymentFormVehiclePage;
  let fixture: ComponentFixture<PaymentFormVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFormVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
