import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentHomePagePage } from './resident-home-page.page';

describe('ResidentHomePagePage', () => {
  let component: ResidentHomePagePage;
  let fixture: ComponentFixture<ResidentHomePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentHomePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
