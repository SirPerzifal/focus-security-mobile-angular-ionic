import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsFacilityDetailPage } from './records-facility-detail.page';

describe('RecordsFacilityDetailPage', () => {
  let component: RecordsFacilityDetailPage;
  let fixture: ComponentFixture<RecordsFacilityDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsFacilityDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
