import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakeANewEventPage } from './make-a-new-event.page';

describe('MakeANewEventPage', () => {
  let component: MakeANewEventPage;
  let fixture: ComponentFixture<MakeANewEventPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeANewEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
