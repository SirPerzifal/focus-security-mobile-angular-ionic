import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-modal-show-qr-access-door',
  templateUrl: './modal-show-qr-access-door.component.html',
  styleUrls: ['./modal-show-qr-access-door.component.scss'],
})
export class ModalShowQRAccessDoorComponent  implements OnInit {

  @Input() QRResult: string = '';
  @Input() closeModalTime: number = 0;

  countdown: number = 0;
  private timeoutId: any;
  private intervalId: any;

  constructor(
    private modalController: ModalController,
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    console.log('closeModalTime:', this.closeModalTime);
    
    // Set countdown awal (convert dari milidetik ke detik)
    this.countdown = Math.ceil(this.closeModalTime / 1000);
    
    // Auto close modal jika closeModalTime lebih dari 0
    if (this.closeModalTime > 0) {
      // Update countdown setiap detik
      this.intervalId = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.intervalId);
        }
      }, 1000);

      // Auto close setelah closeModalTime
      this.timeoutId = setTimeout(() => {
        this.closeModal();
      }, this.closeModalTime);
    }
  }

  ngOnDestroy() {
    // Clear timeout untuk mencegah memory leak
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  closeModal() {
    this.modalController.dismiss('closed');
  }
}
