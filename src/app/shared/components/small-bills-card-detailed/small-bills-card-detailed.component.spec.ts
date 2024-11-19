import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmallBillsCardDetailedComponent } from './small-bills-card-detailed.component';

describe('SmallBillsCardDetailedComponent', () => {
  let component: SmallBillsCardDetailedComponent;
  let fixture: ComponentFixture<SmallBillsCardDetailedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallBillsCardDetailedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmallBillsCardDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
