import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueAppDetailPage } from './issue-app-detail.page';

describe('IssueAppDetailPage', () => {
  let component: IssueAppDetailPage;
  let fixture: ComponentFixture<IssueAppDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueAppDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
