import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BicycleTagApplicationPage } from './bicycle-tag-application.page';

describe('BicycleTagApplicationPage', () => {
  let component: BicycleTagApplicationPage;
  let fixture: ComponentFixture<BicycleTagApplicationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleTagApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
