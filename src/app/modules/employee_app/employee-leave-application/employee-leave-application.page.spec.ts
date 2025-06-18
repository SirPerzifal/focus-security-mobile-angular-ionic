import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeLeaveApplicationPage } from './employee-leave-application.page';

describe('EmployeeLeaveApplicationPage', () => {
  let component: EmployeeLeaveApplicationPage;
  let fixture: ComponentFixture<EmployeeLeaveApplicationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaveApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
