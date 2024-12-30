import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordPage } from './record.page';

describe('RecordPage', () => {
  let component: RecordPage;
  let fixture: ComponentFixture<RecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
