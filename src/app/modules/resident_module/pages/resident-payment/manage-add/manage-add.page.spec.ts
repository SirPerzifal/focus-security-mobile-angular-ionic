import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAddPage } from './manage-add.page';

describe('ManageAddPage', () => {
  let component: ManageAddPage;
  let fixture: ComponentFixture<ManageAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
