import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentHomepagePage } from './resident-home-page.page';

describe('ResidentHomepagePage', () => {
  let component: ResidentHomepagePage;
  let fixture: ComponentFixture<ResidentHomepagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentHomepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
