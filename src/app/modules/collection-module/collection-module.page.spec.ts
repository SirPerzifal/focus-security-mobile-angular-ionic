import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionModulePage } from './collection-module.page';

describe('CollectionModulePage', () => {
  let component: CollectionModulePage;
  let fixture: ComponentFixture<CollectionModulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
