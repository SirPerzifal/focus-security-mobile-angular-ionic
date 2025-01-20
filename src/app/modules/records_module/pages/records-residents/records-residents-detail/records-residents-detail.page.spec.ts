import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsResidentsDetailPage } from './records-residents-detail.page';

describe('RecordsResidentsDetailPage', () => {
  let component: RecordsResidentsDetailPage;
  let fixture: ComponentFixture<RecordsResidentsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsResidentsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
