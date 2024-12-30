import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordAppReportPage } from './record-app-report.page';

describe('RecordAppReportPage', () => {
  let component: RecordAppReportPage;
  let fixture: ComponentFixture<RecordAppReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAppReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
