import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryInContractorPage } from './history-in-contractor.page';

describe('HistoryInContractorPage', () => {
  let component: HistoryInContractorPage;
  let fixture: ComponentFixture<HistoryInContractorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryInContractorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
