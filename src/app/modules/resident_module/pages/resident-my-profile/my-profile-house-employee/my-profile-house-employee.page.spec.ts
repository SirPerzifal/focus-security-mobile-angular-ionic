import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileHouseEmployeePage } from './my-profile-house-employee.page';

describe('MyProfileHouseEmployeePage', () => {
  let component: MyProfileHouseEmployeePage;
  let fixture: ComponentFixture<MyProfileHouseEmployeePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileHouseEmployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
