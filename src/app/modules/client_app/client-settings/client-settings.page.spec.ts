import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientSettingsPage } from './client-settings.page';

describe('ClientSettingsPage', () => {
  let component: ClientSettingsPage;
  let fixture: ComponentFixture<ClientSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
