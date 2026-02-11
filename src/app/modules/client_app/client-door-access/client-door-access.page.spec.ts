import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDoorAccessPage } from './client-door-access.page';

describe('ClientDoorAccessPage', () => {
  let component: ClientDoorAccessPage;
  let fixture: ComponentFixture<ClientDoorAccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDoorAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
