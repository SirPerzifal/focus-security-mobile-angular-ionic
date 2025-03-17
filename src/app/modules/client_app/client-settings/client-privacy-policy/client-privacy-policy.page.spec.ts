import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPrivacyPolicyPage } from './client-privacy-policy.page';

describe('ClientPrivacyPolicyPage', () => {
  let component: ClientPrivacyPolicyPage;
  let fixture: ComponentFixture<ClientPrivacyPolicyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPrivacyPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
