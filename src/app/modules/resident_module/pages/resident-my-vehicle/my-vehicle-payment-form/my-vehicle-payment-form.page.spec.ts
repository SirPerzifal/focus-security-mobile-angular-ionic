import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyVehiclePaymentFormPage } from './my-vehicle-payment-form.page';

describe('MyVehiclePaymentFormPage', () => {
  let component: MyVehiclePaymentFormPage;
  let fixture: ComponentFixture<MyVehiclePaymentFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVehiclePaymentFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
