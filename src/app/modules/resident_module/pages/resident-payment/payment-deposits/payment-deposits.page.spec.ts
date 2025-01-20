import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentDepositsPage } from './payment-deposits.page';

describe('PaymentDepositsPage', () => {
  let component: PaymentDepositsPage;
  let fixture: ComponentFixture<PaymentDepositsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDepositsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
