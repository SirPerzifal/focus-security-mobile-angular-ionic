import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractorNricScanPage } from './contractor-nric-scan.page';

describe('ContractorNricScanPage', () => {
  let component: ContractorNricScanPage;
  let fixture: ComponentFixture<ContractorNricScanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorNricScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
