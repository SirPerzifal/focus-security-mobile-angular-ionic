import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryOfEventPage } from './history-of-event.page';

describe('HistoryOfEventPage', () => {
  let component: HistoryOfEventPage;
  let fixture: ComponentFixture<HistoryOfEventPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOfEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
