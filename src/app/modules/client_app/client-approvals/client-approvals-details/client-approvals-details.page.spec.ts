import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientApprovalsDetailsPage } from './client-approvals-details.page';

describe('ClientApprovalsDetailsPage', () => {
  let component: ClientApprovalsDetailsPage;
  let fixture: ComponentFixture<ClientApprovalsDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientApprovalsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
