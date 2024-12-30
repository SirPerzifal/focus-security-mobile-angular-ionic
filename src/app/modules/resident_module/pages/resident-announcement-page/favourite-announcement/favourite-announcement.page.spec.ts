import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouriteAnnouncementPage } from './favourite-announcement.page';

describe('FavouriteAnnouncementPage', () => {
  let component: FavouriteAnnouncementPage;
  let fixture: ComponentFixture<FavouriteAnnouncementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteAnnouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
