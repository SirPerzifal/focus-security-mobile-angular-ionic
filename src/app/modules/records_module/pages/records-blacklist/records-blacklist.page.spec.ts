import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsBlacklistPage } from './records-blacklist.page';

describe('RecordsBlacklistPage', () => {
  let component: RecordsBlacklistPage;
  let fixture: ComponentFixture<RecordsBlacklistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsBlacklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
