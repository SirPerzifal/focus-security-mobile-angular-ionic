import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityPlaceBookingPage } from './facility-place-booking.page';

describe('FacilityPlaceBookingPage', () => {
  let component: FacilityPlaceBookingPage;
  let fixture: ComponentFixture<FacilityPlaceBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityPlaceBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
