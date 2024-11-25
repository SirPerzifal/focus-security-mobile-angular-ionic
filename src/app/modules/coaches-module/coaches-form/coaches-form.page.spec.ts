import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoachesFormPage } from './coaches-form.page';

describe('CoachesFormPage', () => {
  let component: CoachesFormPage;
  let fixture: ComponentFixture<CoachesFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
