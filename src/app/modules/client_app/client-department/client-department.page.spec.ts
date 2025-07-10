import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDepartmentPage } from './client-department.page';

describe('ClientDepartmentPage', () => {
  let component: ClientDepartmentPage;
  let fixture: ComponentFixture<ClientDepartmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDepartmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
