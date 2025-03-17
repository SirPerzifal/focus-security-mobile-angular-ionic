import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientApprovalsPage } from './client-approvals.page';

describe('ClientApprovalsPage', () => {
  let component: ClientApprovalsPage;
  let fixture: ComponentFixture<ClientApprovalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientApprovalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
