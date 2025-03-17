import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFacilityBookingDetailPage } from './client-facility-booking-detail.page';

describe('ClientFacilityBookingDetailPage', () => {
  let component: ClientFacilityBookingDetailPage;
  let fixture: ComponentFixture<ClientFacilityBookingDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFacilityBookingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
