import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormForRegistrationPetPage } from './form-for-registration-pet.page';

describe('FormForRegistrationPetPage', () => {
  let component: FormForRegistrationPetPage;
  let fixture: ComponentFixture<FormForRegistrationPetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormForRegistrationPetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
