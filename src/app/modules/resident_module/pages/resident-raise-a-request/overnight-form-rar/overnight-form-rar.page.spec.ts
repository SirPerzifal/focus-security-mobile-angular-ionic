import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OvernightFormRarPage } from './overnight-form-rar.page';

describe('OvernightFormRarPage', () => {
  let component: OvernightFormRarPage;
  let fixture: ComponentFixture<OvernightFormRarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OvernightFormRarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
