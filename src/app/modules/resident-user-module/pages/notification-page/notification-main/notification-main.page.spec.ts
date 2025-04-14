import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationMainPage } from './notification-main.page';

describe('NotificationMainPage', () => {
  let component: NotificationMainPage;
  let fixture: ComponentFixture<NotificationMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
