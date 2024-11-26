import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaVisitorFormPage } from './ma-visitor-form.page';

describe('MaVisitorFormPage', () => {
  let component: MaVisitorFormPage;
  let fixture: ComponentFixture<MaVisitorFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaVisitorFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
