import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-upload-receipt-modal',
  templateUrl: './upload-receipt-modal.component.html',
  styleUrls: ['./upload-receipt-modal.component.scss'],
})
export class UploadReceiptModalComponent  implements OnInit {

  isModalUploadReceiptOpen: boolean = false;
  selectedFileName: string = '';
  receiptBase64: string = '';

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

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
