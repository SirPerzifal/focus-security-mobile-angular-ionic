import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { M2mSelectionReadonlyComponent } from './m2m-selection-readonly.component';

describe('M2mSelectionReadonlyComponent', () => {
  let component: M2mSelectionReadonlyComponent;
  let fixture: ComponentFixture<M2mSelectionReadonlyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ M2mSelectionReadonlyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(M2mSelectionReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
