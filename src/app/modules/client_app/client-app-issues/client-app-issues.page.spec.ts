import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientAppIssuesPage } from './client-app-issues.page';

describe('ClientAppIssuesPage', () => {
  let component: ClientAppIssuesPage;
  let fixture: ComponentFixture<ClientAppIssuesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAppIssuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
