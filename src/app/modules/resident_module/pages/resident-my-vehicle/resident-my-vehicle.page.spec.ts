import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentMyVehiclePage } from './resident-my-vehicle.page';

describe('ResidentMyVehiclePage', () => {
  let component: ResidentMyVehiclePage;
  let fixture: ComponentFixture<ResidentMyVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentMyVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
