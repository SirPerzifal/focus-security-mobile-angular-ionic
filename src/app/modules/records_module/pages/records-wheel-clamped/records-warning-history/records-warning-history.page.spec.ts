import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsWarningHistoryPage } from './records-warning-history.page';

describe('RecordsWarningHistoryPage', () => {
  let component: RecordsWarningHistoryPage;
  let fixture: ComponentFixture<RecordsWarningHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsWarningHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
