import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsFacilityPage } from './records-facility.page';

describe('RecordsFacilityPage', () => {
  let component: RecordsFacilityPage;
  let fixture: ComponentFixture<RecordsFacilityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsFacilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
