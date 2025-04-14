import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractorCommercialMainPage } from './contractor-commercial-main.page';

describe('ContractorCommercialMainPage', () => {
  let component: ContractorCommercialMainPage;
  let fixture: ComponentFixture<ContractorCommercialMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorCommercialMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
