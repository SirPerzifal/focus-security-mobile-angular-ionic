import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyVehicleMainPage } from './my-vehicle-main.page';

describe('MyVehicleMainPage', () => {
  let component: MyVehicleMainPage;
  let fixture: ComponentFixture<MyVehicleMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVehicleMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
