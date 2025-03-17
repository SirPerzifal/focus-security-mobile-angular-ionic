import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsMainPage } from './settings-main.page';

describe('SettingsMainPage', () => {
  let component: SettingsMainPage;
  let fixture: ComponentFixture<SettingsMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
