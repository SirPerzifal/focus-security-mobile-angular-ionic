import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDeliveryPage } from './client-delivery.page';

describe('ClientDeliveryPage', () => {
  let component: ClientDeliveryPage;
  let fixture: ComponentFixture<ClientDeliveryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDeliveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
