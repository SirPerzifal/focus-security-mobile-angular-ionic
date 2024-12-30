import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsWarningDetailPage } from './records-warning-detail.page';

describe('RecordsWarningDetailPage', () => {
  let component: RecordsWarningDetailPage;
  let fixture: ComponentFixture<RecordsWarningDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsWarningDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
