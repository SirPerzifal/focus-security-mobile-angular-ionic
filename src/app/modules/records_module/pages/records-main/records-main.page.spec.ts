import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsMainPage } from './records-main.page';

describe('RecordsMainPage', () => {
  let component: RecordsMainPage;
  let fixture: ComponentFixture<RecordsMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
