import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalkInPage } from './walk-in.page';

describe('WalkInPage', () => {
  let component: WalkInPage;
  let fixture: ComponentFixture<WalkInPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
