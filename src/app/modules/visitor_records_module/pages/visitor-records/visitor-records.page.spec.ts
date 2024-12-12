import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitorRecordsPage } from './visitor-records.page';

describe('VisitorRecordsPage', () => {
  let component: VisitorRecordsPage;
  let fixture: ComponentFixture<VisitorRecordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
