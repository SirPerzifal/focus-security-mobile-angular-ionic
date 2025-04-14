import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CondoIssueReportMainPage } from './condo-issue-report-main.page';

describe('CondoIssueReportMainPage', () => {
  let component: CondoIssueReportMainPage;
  let fixture: ComponentFixture<CondoIssueReportMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CondoIssueReportMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
