import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentAnnouncementPagePage } from './resident-announcement-page.page';

describe('ResidentAnnouncementPagePage', () => {
  let component: ResidentAnnouncementPagePage;
  let fixture: ComponentFixture<ResidentAnnouncementPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentAnnouncementPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
