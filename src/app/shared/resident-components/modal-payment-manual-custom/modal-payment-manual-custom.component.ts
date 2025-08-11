import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-modal-payment-manual-custom',
  templateUrl: './modal-payment-manual-custom.component.html',
  styleUrls: ['./modal-payment-manual-custom.component.scss'],
})
export class ModalPaymentManualCustomComponent  implements OnInit {
  selectedPaymentReceipt: string = '';
  base64Receipt: string = '';
  projectId: number = 0;
  amountPayable: string = '';
  qrCodeImage: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false
  }

  constructor(private modalController: ModalController, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.projectId = Number(parseValue.project_id);
        this.loadQRCode();
        this.loadAmount();
      }
    })
  }

  loadQRCode() {
    this.mainApiResidentService.endpointProcess({
      project_id: this.projectId
    }, 'get/payment_qr_code').subscribe((result: any) => {
      this.qrCodeImage = result.result.qr_code;
    })
  }

  donwloadQris() {
    if (!this.qrCodeImage) {
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

  loadAmount() {
    this.mainApiResidentService.endpointProcess({
      project_id: this.projectId
    }, 'get/raise_a_request_charge').subscribe((result: any) => {
      this.amountType = {
        amountUntaxed: result.result.result.amount_untaxed,
        amountTaxed: result.result.result.amount_taxed,
        amountTotal: result.result.result.amount_total,
        isIncludeGST: result.result.result.is_include_gst
      };
      this.amountPayable = this.amountType.amountTotal;
    })
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

  onPaymentReceiptChange(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedPaymentReceipt = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.base64Receipt = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedPaymentReceipt = ''; // Reset if no file is selected
    }
  }

  didmissToProcess() {
    console.log(this.base64Receipt);
    
    if (!this.base64Receipt) {
      this.functionMain.presentToast('Please upload payment receipt', 'danger');
      return;
    }
    this.modalController.dismiss(this.base64Receipt)
  }
}
