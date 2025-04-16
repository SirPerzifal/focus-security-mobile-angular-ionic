import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailHistoryInCommercialPage } from './detail-history-in-commercial.page';

describe('DetailHistoryInCommercialPage', () => {
  let component: DetailHistoryInCommercialPage;
  let fixture: ComponentFixture<DetailHistoryInCommercialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailHistoryInCommercialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
