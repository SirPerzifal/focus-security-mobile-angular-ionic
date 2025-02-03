import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakeAnEventPage } from './make-an-event.page';

describe('MakeAnEventPage', () => {
  let component: MakeAnEventPage;
  let fixture: ComponentFixture<MakeAnEventPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeAnEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
