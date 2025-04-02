import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPaymentSettingsPage } from './client-payment-settings.page';

describe('ClientPaymentSettingsPage', () => {
  let component: ClientPaymentSettingsPage;
  let fixture: ComponentFixture<ClientPaymentSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
