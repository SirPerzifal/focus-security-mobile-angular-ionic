import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsContractorPage } from './records-contractor.page';

describe('RecordsContractorPage', () => {
  let component: RecordsContractorPage;
  let fixture: ComponentFixture<RecordsContractorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsContractorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
