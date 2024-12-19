import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OvernightParkingFormPage } from './overnight-parking-form.page';

describe('OvernightParkingFormPage', () => {
  let component: OvernightParkingFormPage;
  let fixture: ComponentFixture<OvernightParkingFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OvernightParkingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
