import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveHomePage } from './move-home.page';

describe('MoveHomePage', () => {
  let component: MoveHomePage;
  let fixture: ComponentFixture<MoveHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
