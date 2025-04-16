import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractorInvitingFromHistoryPage } from './contractor-inviting-from-history.page';

describe('ContractorInvitingFromHistoryPage', () => {
  let component: ContractorInvitingFromHistoryPage;
  let fixture: ComponentFixture<ContractorInvitingFromHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorInvitingFromHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
