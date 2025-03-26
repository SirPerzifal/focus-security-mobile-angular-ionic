import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientResidentsPage } from './client-residents.page';

describe('ClientResidentsPage', () => {
  let component: ClientResidentsPage;
  let fixture: ComponentFixture<ClientResidentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientResidentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
