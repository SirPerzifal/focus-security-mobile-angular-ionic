import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentSettingsPagePage } from './resident-settings-page.page';

describe('ResidentSettingsPagePage', () => {
  let component: ResidentSettingsPagePage;
  let fixture: ComponentFixture<ResidentSettingsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentSettingsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
