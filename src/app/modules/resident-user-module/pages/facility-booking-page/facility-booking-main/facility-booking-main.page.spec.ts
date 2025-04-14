import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityBookingMainPage } from './facility-booking-main.page';

describe('FacilityBookingMainPage', () => {
  let component: FacilityBookingMainPage;
  let fixture: ComponentFixture<FacilityBookingMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBookingMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
