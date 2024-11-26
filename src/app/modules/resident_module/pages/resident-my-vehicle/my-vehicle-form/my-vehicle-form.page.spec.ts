import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyVehicleFormPage } from './my-vehicle-form.page';

describe('MyVehicleFormPage', () => {
  let component: MyVehicleFormPage;
  let fixture: ComponentFixture<MyVehicleFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVehicleFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
