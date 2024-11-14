import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiredCarPage } from './hired-car.page';

describe('HiredCarPage', () => {
  let component: HiredCarPage;
  let fixture: ComponentFixture<HiredCarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HiredCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
