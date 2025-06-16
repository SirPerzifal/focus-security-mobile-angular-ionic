import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeSchedulePage } from './employee-schedule.page';

describe('EmployeeSchedulePage', () => {
  let component: EmployeeSchedulePage;
  let fixture: ComponentFixture<EmployeeSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
