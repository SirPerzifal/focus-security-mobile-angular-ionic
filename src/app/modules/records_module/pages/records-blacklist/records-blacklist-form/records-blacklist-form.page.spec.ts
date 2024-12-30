import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsBlacklistFormPage } from './records-blacklist-form.page';

describe('RecordsBlacklistFormPage', () => {
  let component: RecordsBlacklistFormPage;
  let fixture: ComponentFixture<RecordsBlacklistFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsBlacklistFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
