import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteFromHistoryPage } from './invite-from-history.page';

describe('InviteFromHistoryPage', () => {
  let component: InviteFromHistoryPage;
  let fixture: ComponentFixture<InviteFromHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFromHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
