import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-upload-receipt-modal',
  templateUrl: './upload-receipt-modal.component.html',
  styleUrls: ['./upload-receipt-modal.component.scss'],
})
export class UploadReceiptModalComponent  implements OnInit {

  isModalUploadReceiptOpen: boolean = false;
  selectedFileName: string = '';
  receiptBase64: string = '';
  qrCodeImage: string = '';

  constructor(
    private modalController: ModalController,
    private mainApiResidentService: MainApiResidentService,
    public functionMainService: FunctionMainService
  ) { }

  ngOnInit() {}

  loadQRCode() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/payment_qr_code').subscribe((result: any) => {
      this.qrCodeImage = result.result.qr_code;
    })
  }

  donwloadQris() {
    if (!this.qrCodeImage) {
      this.functionMainService.presentToast('QR Code image is not available', 'danger');
      return;
    }
  
    // Membuat elemen <a> untuk mendownload gambar
    const link = document.createElement('a');
    link.href = this.qrCodeImage; // Mengatur href ke base64 image
    link.download = 'qr_code.png'; // Menentukan nama file yang akan diunduh
  
    // Menambahkan elemen ke body dan memicu klik
    document.body.appendChild(link);
    link.click();
  
    // Menghapus elemen setelah klik
    document.body.removeChild(link);
  }

  uploadReceipt(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.receiptBase64 = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
  }

  onSubmitReceipt() {
    this.modalController.dismiss(this.receiptBase64)
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

}
