import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagePaymentMethodPage } from './manage-payment-method.page';

describe('ManagePaymentMethodPage', () => {
  let component: ManagePaymentMethodPage;
  let fixture: ComponentFixture<ManagePaymentMethodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentMethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
