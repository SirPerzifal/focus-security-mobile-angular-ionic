import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitorInvitigFormPage } from './visitor-invitig-form.page';

describe('VisitorInvitigFormPage', () => {
  let component: VisitorInvitigFormPage;
  let fixture: ComponentFixture<VisitorInvitigFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorInvitigFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
