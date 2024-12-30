import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsVisitorPage } from './records-visitor.page';

describe('RecordsVisitorPage', () => {
  let component: RecordsVisitorPage;
  let fixture: ComponentFixture<RecordsVisitorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
