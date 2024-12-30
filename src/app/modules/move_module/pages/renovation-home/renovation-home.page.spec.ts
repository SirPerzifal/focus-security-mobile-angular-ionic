import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenovationHomePage } from './renovation-home.page';

describe('RenovationHomePage', () => {
  let component: RenovationHomePage;
  let fixture: ComponentFixture<RenovationHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovationHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
