import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiredCardInVisitorPage } from './hired-card-in-visitor.page';

describe('HiredCardInVisitorPage', () => {
  let component: HiredCardInVisitorPage;
  let fixture: ComponentFixture<HiredCardInVisitorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HiredCardInVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
