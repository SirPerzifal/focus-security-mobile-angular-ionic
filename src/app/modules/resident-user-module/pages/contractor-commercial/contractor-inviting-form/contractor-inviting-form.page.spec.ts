import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractorInvitingFormPage } from './contractor-inviting-form.page';

describe('ContractorInvitingFormPage', () => {
  let component: ContractorInvitingFormPage;
  let fixture: ComponentFixture<ContractorInvitingFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorInvitingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
