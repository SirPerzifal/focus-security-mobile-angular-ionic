import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityHistoryFormPage } from './facility-history-form.page';

describe('FacilityHistoryFormPage', () => {
  let component: FacilityHistoryFormPage;
  let fixture: ComponentFixture<FacilityHistoryFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityHistoryFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
