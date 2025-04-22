import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VmsCheckoutPage } from './vms-checkout.page';

describe('VmsCheckoutPage', () => {
  let component: VmsCheckoutPage;
  let fixture: ComponentFixture<VmsCheckoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsCheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
