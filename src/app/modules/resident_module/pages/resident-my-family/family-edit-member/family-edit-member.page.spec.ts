import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyEditMemberPage } from './family-edit-member.page';

describe('FamilyEditMemberPage', () => {
  let component: FamilyEditMemberPage;
  let fixture: ComponentFixture<FamilyEditMemberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyEditMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
