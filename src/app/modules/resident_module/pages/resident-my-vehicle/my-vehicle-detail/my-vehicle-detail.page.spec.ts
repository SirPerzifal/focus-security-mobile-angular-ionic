import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyVehicleDetailPage } from './my-vehicle-detail.page';

describe('MyVehicleDetailPage', () => {
  let component: MyVehicleDetailPage;
  let fixture: ComponentFixture<MyVehicleDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVehicleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
