import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
  amountPayable: string = '';
  qrCodeImage: string = '';
  qrCodeMime: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false
  }

  constructor(private modalController: ModalController, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.loadQRCode();
    this.loadAmount();
  }

  loadQRCode() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/payment_qr_code').subscribe((result: any) => {
      console.log(result);
      
      this.qrCodeImage = result.result.qr_code;
      this.qrCodeMime = result.result.qr_code_mime;
    })
  }

  async donwloadQris() {
    try {
      const byteCharacters = atob(this.qrCodeImage);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: this.qrCodeMime });

      if (Capacitor.isNativePlatform()) {
        const base64 = await this.convertBlobToBase64(blob);
        const saveFile = await Filesystem.writeFile({
          path: `QR-Code-.png`,
          data: base64,
          directory: Directory.Data
        });
        const path = saveFile.uri;
        await FileOpener.open({
          filePath: path,
          contentType: blob.type
        });
        // console.log('File is opened');
      } else {
        const href = window.URL.createObjectURL(blob);
        this.downloadFile(href, `QR-Code-.png`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // Optionally, show an error message to the user
    }
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  downloadFile(href: string, filename: string) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        // Periksa apakah parentNode tidak null sebelum menghapus
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 0);
  }

  loadAmount() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/raise_a_request_charge').subscribe((result: any) => {
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
