import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingNotificationPage } from './setting-notification.page';

describe('SettingNotificationPage', () => {
  let component: SettingNotificationPage;
  let fixture: ComponentFixture<SettingNotificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
