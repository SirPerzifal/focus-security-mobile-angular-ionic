import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteFormPage } from './invite-form.page';

describe('InviteFormPage', () => {
  let component: InviteFormPage;
  let fixture: ComponentFixture<InviteFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
