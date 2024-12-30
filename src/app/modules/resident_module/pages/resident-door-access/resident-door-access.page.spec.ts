import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentDoorAccessPage } from './resident-door-access.page';

describe('ResidentDoorAccessPage', () => {
  let component: ResidentDoorAccessPage;
  let fixture: ComponentFixture<ResidentDoorAccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentDoorAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
