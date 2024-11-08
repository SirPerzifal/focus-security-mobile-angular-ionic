import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickUpPagePage } from './pick-up-page.page';

describe('PickUpPagePage', () => {
  let component: PickUpPagePage;
  let fixture: ComponentFixture<PickUpPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PickUpPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
