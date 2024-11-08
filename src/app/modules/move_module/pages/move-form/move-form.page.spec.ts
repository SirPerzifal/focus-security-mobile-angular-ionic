import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveFormPage } from './move-form.page';

describe('MoveFormPage', () => {
  let component: MoveFormPage;
  let fixture: ComponentFixture<MoveFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
