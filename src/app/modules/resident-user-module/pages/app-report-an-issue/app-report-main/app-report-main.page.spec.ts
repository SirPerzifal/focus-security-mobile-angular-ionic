import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppReportMainPage } from './app-report-main.page';

describe('AppReportMainPage', () => {
  let component: AppReportMainPage;
  let fixture: ComponentFixture<AppReportMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReportMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
