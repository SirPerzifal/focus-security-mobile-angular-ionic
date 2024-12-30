import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsFacilityCheckOutPage } from './records-facility-check-out.page';

describe('RecordsFacilityCheckOutPage', () => {
  let component: RecordsFacilityCheckOutPage;
  let fixture: ComponentFixture<RecordsFacilityCheckOutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsFacilityCheckOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
