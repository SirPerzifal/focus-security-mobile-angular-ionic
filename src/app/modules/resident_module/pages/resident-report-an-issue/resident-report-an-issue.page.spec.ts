import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentReportAnIssuePage } from './resident-report-an-issue.page';

describe('ResidentReportAnIssuePage', () => {
  let component: ResidentReportAnIssuePage;
  let fixture: ComponentFixture<ResidentReportAnIssuePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentReportAnIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
