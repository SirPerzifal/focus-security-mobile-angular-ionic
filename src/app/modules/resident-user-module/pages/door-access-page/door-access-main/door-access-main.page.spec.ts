import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoorAccessMainPage } from './door-access-main.page';

describe('DoorAccessMainPage', () => {
  let component: DoorAccessMainPage;
  let fixture: ComponentFixture<DoorAccessMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoorAccessMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
