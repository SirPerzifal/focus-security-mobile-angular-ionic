import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmergencyModulePage } from './emergency-module.page';

describe('EmergencyModulePage', () => {
  let component: EmergencyModulePage;
  let fixture: ComponentFixture<EmergencyModulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
