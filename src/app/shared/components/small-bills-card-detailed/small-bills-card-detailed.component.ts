import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { fines } from 'src/models/resident/poymentModel.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-small-bills-card-detailed',
  templateUrl: './small-bills-card-detailed.component.html',
  styleUrls: ['./small-bills-card-detailed.component.scss'],
})
export class SmallBillsCardDetailedComponent  implements OnInit, OnDestroy {

  constructor(public functionMainService: FunctionMainService) { }

  @Input() fines: any;
  
  
  @Output() buttonClick = new EventEmitter<{ isActive: boolean, paymentId: number }>(); // Emit objek dengan teks dan status aktif
  
  ngOnInit() {
    // console.log(this.fines);
  }

  payNow(id: number) {
    this.buttonClick.emit({ isActive: true, paymentId: id }); // Emit objek dengan teks dan status aktif
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
