import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentMyFamilyPage } from './resident-my-family.page';

describe('ResidentMyFamilyPage', () => {
  let component: ResidentMyFamilyPage;
  let fixture: ComponentFixture<ResidentMyFamilyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentMyFamilyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
