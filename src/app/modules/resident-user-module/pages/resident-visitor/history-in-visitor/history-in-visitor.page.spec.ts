import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryInVisitorPage } from './history-in-visitor.page';

describe('HistoryInVisitorPage', () => {
  let component: HistoryInVisitorPage;
  let fixture: ComponentFixture<HistoryInVisitorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryInVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
