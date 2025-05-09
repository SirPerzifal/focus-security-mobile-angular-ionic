import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormForRequestAccessCardPage } from './form-for-request-access-card.page';

describe('FormForRequestAccessCardPage', () => {
  let component: FormForRequestAccessCardPage;
  let fixture: ComponentFixture<FormForRequestAccessCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormForRequestAccessCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
