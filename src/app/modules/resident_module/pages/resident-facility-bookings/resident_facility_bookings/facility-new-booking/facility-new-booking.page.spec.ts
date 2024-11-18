import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityNewBookingPage } from './facility-new-booking.page';

describe('FacilityNewBookingPage', () => {
  let component: FacilityNewBookingPage;
  let fixture: ComponentFixture<FacilityNewBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityNewBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
