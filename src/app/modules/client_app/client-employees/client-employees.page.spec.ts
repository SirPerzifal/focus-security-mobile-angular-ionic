import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientEmployeesPage } from './client-employees.page';

describe('ClientEmployeesPage', () => {
  let component: ClientEmployeesPage;
  let fixture: ComponentFixture<ClientEmployeesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEmployeesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
