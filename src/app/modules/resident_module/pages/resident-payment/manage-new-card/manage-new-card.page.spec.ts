import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageNewCardPage } from './manage-new-card.page';

describe('ManageNewCardPage', () => {
  let component: ManageNewCardPage;
  let fixture: ComponentFixture<ManageNewCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNewCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
