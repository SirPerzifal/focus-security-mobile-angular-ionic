import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailHistoryInVisitorPage } from './detail-history-in-visitor.page';

describe('DetailHistoryInVisitorPage', () => {
  let component: DetailHistoryInVisitorPage;
  let fixture: ComponentFixture<DetailHistoryInVisitorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailHistoryInVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
