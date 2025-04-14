import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyMainPage } from './family-main.page';

describe('FamilyMainPage', () => {
  let component: FamilyMainPage;
  let fixture: ComponentFixture<FamilyMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
