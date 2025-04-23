import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyFormPage } from './family-form.page';

describe('FamilyFormPage', () => {
  let component: FamilyFormPage;
  let fixture: ComponentFixture<FamilyFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
