import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnregisteredSimulationModulePage } from './unregistered-simulation-module.page';

describe('UnregisteredSimulationModulePage', () => {
  let component: UnregisteredSimulationModulePage;
  let fixture: ComponentFixture<UnregisteredSimulationModulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredSimulationModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
