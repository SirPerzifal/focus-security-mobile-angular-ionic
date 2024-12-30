import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsVisitorDetailPage } from './records-visitor-detail.page';

describe('RecordsVisitorDetailPage', () => {
  let component: RecordsVisitorDetailPage;
  let fixture: ComponentFixture<RecordsVisitorDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsVisitorDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
