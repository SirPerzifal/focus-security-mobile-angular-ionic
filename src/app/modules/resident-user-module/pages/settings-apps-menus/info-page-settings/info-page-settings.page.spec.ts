import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPageSettingsPage } from './info-page-settings.page';

describe('InfoPageSettingsPage', () => {
  let component: InfoPageSettingsPage;
  let fixture: ComponentFixture<InfoPageSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPageSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
