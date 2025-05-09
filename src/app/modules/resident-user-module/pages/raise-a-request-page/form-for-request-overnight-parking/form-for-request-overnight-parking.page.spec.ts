import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormForRequestOvernightParkingPage } from './form-for-request-overnight-parking.page';

describe('FormForRequestOvernightParkingPage', () => {
  let component: FormForRequestOvernightParkingPage;
  let fixture: ComponentFixture<FormForRequestOvernightParkingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormForRequestOvernightParkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
