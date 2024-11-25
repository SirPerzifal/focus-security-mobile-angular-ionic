import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoachesModulePage } from './coaches-module.page';

describe('CoachesModulePage', () => {
  let component: CoachesModulePage;
  let fixture: ComponentFixture<CoachesModulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
