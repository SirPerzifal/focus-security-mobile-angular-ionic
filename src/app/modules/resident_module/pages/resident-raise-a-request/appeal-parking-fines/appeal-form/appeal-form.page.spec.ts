import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppealFormPage } from './appeal-form.page';

describe('AppealFormPage', () => {
  let component: AppealFormPage;
  let fixture: ComponentFixture<AppealFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
