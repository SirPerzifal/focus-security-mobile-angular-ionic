import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsBlacklistDetailPage } from './records-blacklist-detail.page';

describe('RecordsBlacklistDetailPage', () => {
  let component: RecordsBlacklistDetailPage;
  let fixture: ComponentFixture<RecordsBlacklistDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsBlacklistDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
