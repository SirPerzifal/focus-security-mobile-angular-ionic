import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeMainPage } from './employee-main.page';

describe('EmployeeMainPage', () => {
  let component: EmployeeMainPage;
  let fixture: ComponentFixture<EmployeeMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
