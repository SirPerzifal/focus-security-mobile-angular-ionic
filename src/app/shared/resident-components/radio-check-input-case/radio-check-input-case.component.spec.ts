import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadioCheckInputCaseComponent } from './radio-check-input-case.component';

describe('RadioCheckInputCaseComponent', () => {
  let component: RadioCheckInputCaseComponent;
  let fixture: ComponentFixture<RadioCheckInputCaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioCheckInputCaseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioCheckInputCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
