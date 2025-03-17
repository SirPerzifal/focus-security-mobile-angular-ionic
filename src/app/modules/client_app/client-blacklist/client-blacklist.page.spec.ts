import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientBlacklistPage } from './client-blacklist.page';

describe('ClientBlacklistPage', () => {
  let component: ClientBlacklistPage;
  let fixture: ComponentFixture<ClientBlacklistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBlacklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
