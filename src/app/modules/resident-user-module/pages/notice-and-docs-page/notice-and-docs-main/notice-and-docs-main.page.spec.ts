import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoticeAndDocsMainPage } from './notice-and-docs-main.page';

describe('NoticeAndDocsMainPage', () => {
  let component: NoticeAndDocsMainPage;
  let fixture: ComponentFixture<NoticeAndDocsMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeAndDocsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
