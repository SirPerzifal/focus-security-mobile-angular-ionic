import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OvernightParkingModalPage } from './overnight-parking-modal.page';

describe('OvernightParkingModalPage', () => {
  let component: OvernightParkingModalPage;
  let fixture: ComponentFixture<OvernightParkingModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OvernightParkingModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
