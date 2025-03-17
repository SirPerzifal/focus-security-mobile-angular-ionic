import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsContractorDetailPage } from './records-contractor-detail.page';

describe('RecordsContractorDetailPage', () => {
  let component: RecordsContractorDetailPage;
  let fixture: ComponentFixture<RecordsContractorDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsContractorDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
