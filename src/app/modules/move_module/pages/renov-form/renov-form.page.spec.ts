import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenovFormPage } from './renov-form.page';

describe('RenovFormPage', () => {
  let component: RenovFormPage;
  let fixture: ComponentFixture<RenovFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
