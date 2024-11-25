import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyAddMemberPage } from './family-add-member.page';

describe('FamilyAddMemberPage', () => {
  let component: FamilyAddMemberPage;
  let fixture: ComponentFixture<FamilyAddMemberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyAddMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
