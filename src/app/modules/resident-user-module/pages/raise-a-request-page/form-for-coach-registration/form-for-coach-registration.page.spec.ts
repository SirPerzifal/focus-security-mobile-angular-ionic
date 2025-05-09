import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormForCoachRegistrationPage } from './form-for-coach-registration.page';

describe('FormForCoachRegistrationPage', () => {
  let component: FormForCoachRegistrationPage;
  let fixture: ComponentFixture<FormForCoachRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormForCoachRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
