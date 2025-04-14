import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractorCommercialFormPage } from './contractor-commercial-form.page';

describe('ContractorCommercialFormPage', () => {
  let component: ContractorCommercialFormPage;
  let fixture: ComponentFixture<ContractorCommercialFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorCommercialFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
