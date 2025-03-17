import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueAnDetailPage } from './issue-an-detail.page';

describe('IssueAnDetailPage', () => {
  let component: IssueAnDetailPage;
  let fixture: ComponentFixture<IssueAnDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueAnDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
