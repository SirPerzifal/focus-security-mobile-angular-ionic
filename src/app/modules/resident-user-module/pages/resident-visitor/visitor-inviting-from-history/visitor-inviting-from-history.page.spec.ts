import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitorInvitingFromHistoryPage } from './visitor-inviting-from-history.page';

describe('VisitorInvitingFromHistoryPage', () => {
  let component: VisitorInvitingFromHistoryPage;
  let fixture: ComponentFixture<VisitorInvitingFromHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorInvitingFromHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
