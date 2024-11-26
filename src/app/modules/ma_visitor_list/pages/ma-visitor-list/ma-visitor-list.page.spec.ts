import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaVisitorListPage } from './ma-visitor-list.page';

describe('MaVisitorListPage', () => {
  let component: MaVisitorListPage;
  let fixture: ComponentFixture<MaVisitorListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaVisitorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
