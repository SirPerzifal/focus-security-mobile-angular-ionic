import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientHouseRulesPage } from './client-house-rules.page';

describe('ClientHouseRulesPage', () => {
  let component: ClientHouseRulesPage;
  let fixture: ComponentFixture<ClientHouseRulesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHouseRulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
