import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentReportAnAppIssuePage } from './resident-report-an-app-issue.page';

describe('ResidentReportAnAppIssuePage', () => {
  let component: ResidentReportAnAppIssuePage;
  let fixture: ComponentFixture<ResidentReportAnAppIssuePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentReportAnAppIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
