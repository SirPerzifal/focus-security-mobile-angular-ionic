import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VmsBlockUnitComponent } from './vms-block-unit.component';

describe('VmsBlockUnitComponent', () => {
  let component: VmsBlockUnitComponent;
  let fixture: ComponentFixture<VmsBlockUnitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VmsBlockUnitComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VmsBlockUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
