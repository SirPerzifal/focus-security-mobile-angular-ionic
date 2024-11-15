import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentFacilityBookingsPage } from './resident-facility-bookings.page';

describe('ResidentFacilityBookingsPage', () => {
  let component: ResidentFacilityBookingsPage;
  let fixture: ComponentFixture<ResidentFacilityBookingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentFacilityBookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
