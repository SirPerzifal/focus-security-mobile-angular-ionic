import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceFacilityBookingPage } from './place-facility-booking.page';

describe('PlaceFacilityBookingPage', () => {
  let component: PlaceFacilityBookingPage;
  let fixture: ComponentFixture<PlaceFacilityBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceFacilityBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
