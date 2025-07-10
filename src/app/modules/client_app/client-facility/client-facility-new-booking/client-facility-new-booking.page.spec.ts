import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFacilityNewBookingPage } from './client-facility-new-booking.page';

describe('ClientFacilityNewBookingPage', () => {
  let component: ClientFacilityNewBookingPage;
  let fixture: ComponentFixture<ClientFacilityNewBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFacilityNewBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
