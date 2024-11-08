import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractorFormPage } from './contractor-form.page';

describe('ContractorFormPage', () => {
  let component: ContractorFormPage;
  let fixture: ComponentFixture<ContractorFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
