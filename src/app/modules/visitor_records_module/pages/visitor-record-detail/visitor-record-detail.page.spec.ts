import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitorRecordDetailPage } from './visitor-record-detail.page';

describe('VisitorRecordDetailPage', () => {
  let component: VisitorRecordDetailPage;
  let fixture: ComponentFixture<VisitorRecordDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorRecordDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
