import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Html5Qrcode } from 'html5-qrcode';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { Preferences } from '@capacitor/preferences';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-contractor-nric-scan',
  templateUrl: './contractor-nric-scan.page.html',
  styleUrls: ['./contractor-nric-scan.page.scss'],
})
export class ContractorNricScanPage implements OnInit {

  constructor(private modalController: ModalController, private mainVmsService: MainVmsService, private functionMain: FunctionMainService, private getUserInfoService: GetUserInfoService) { }

  ngOnInit() {
    setTimeout(() => {
      this.startScanner()
    })
    this.loadProjectName()
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
    })
  }

  project_id = 191
  min_digit = 0
  max_digit = 0

  ngOnDestroy() {
    this.isListening = false;
    this.htmlScanner.stop().catch(err => console.log(err))
  }

  async getMinMaxNric() {
    try {
      const results = await this.mainVmsService.getApi({ project_id: this.project_id }, '/vms/get/nric_constraint').toPromise();
      console.log(results.result);
      if (results.result.response_code === 200) {
        this.min_digit = results.result.result.min_nric_number_length
        this.max_digit = results.result.result.max_nric_number_length
      } else {
        this.functionMain.presentToast('Failed to get minimum and maximum digit of NRIC / FIN!', 'danger');
      }
    } catch (error) {
      this.functionMain.presentToast('Failed to get minimum and maximum digit of NRIC / FIN!', 'danger');
      console.error(error);
    }
  }

  htmlScanner!: Html5Qrcode
  scannerId = 'reader'
  scanResult = ''
  startScanner() {
    setTimeout(() => {
      this.htmlScanner = new Html5Qrcode(this.scannerId);
      console.log("Scanner Initialized:", this.htmlScanner);
      console.log("WORK")
      this.htmlScanner.start(
        {
          facingMode: "environment"
        },
        {
          fps: 10,
          qrbox: {
            width: 300,
            height: 300,
          }
        },
        (decodedText) => {
          this.scanResult = decodedText
          console.log(this.scanResult)
          console.log({data: this.nric_value, min_digit: this.min_digit, max_digit: this.max_digit})
          this.isListening = false
          this.modalController.dismiss({data: this.scanResult, min_digit: this.min_digit, max_digit: this.max_digit})
        },
        (errorMessage) => {
          console.log(errorMessage)
        }

      ).catch(err => console.log(err));
    }, 500)

  }

  stopScanner() {
    this.htmlScanner.stop().catch(err => console.log(err))
    this.isListening = false
    this.modalController.dismiss({ data: false })
  }

  isListening = true;

  lastKeypressTime: number = 0;
  scanThreshold: number = 50;
  ignored_string = ''
  @HostListener('document:keydown', ['$event'])
  handleScannerInput(event: KeyboardEvent) {
    if (!this.isListening) return

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastKeypressTime;
    this.lastKeypressTime = currentTime;

    if (event.key === 'Shift') {
      return;
    } else if (event.key === 'Enter') {
      this.htmlScanner.stop().catch(err => console.log(err))
      console.log({data: this.nric_value, min_digit: this.min_digit, max_digit: this.max_digit})
      this.isListening = false
      this.modalController.dismiss({data: this.nric_value, min_digit: this.min_digit, max_digit: this.max_digit})
      this.nric_value = '';
    } else {
      if (timeDiff < this.scanThreshold) {
        this.nric_value += this.ignored_string
        this.nric_value += event.key;
        this.ignored_string = ''
      } else {
        this.ignored_string = event.key
        console.log('Ignored human typing:', event.key);
      }
    }

  }

  ionViewWillEnter() {
    this.isListening = true; // Aktifkan kembali saat modal dibuka
  }
  
  checkNric(result: any) {
    console.log(result)
    if (result) {
      console.log(result)
      let nric = result;
      let nric_clear = nric.replace(/([A-Za-z]\d+)([A-Za-z])\d+/, '$1$2');
      console.log(nric, nric_clear, nric_clear.length)
      console.log(this.min_digit, this.max_digit)
      if (nric_clear.length > this.max_digit) {
        this.functionMain.presentToast(`NRIC / FIN cannot be more than ${this.max_digit} digits.`, 'danger');
        return
      }
      if (nric_clear.length < this.min_digit) {
        this.functionMain.presentToast(`NRIC / FIN must be at least ${this.min_digit} digits.`, 'danger');
        return
      }
      let used_nric = nric_clear
        .split('')
        .map((char: any, index: number) => (index >= 1 && index <= nric_clear.length - 5 ? 'X' : char))
        .join('');
      console.log(used_nric)
      
    }
  }

  nric_value = ''
  onNricInput(event: any) {
    console.log(event.target.value)
    this.modalController.dismiss({data: this.scanResult, min_digit: this.min_digit, max_digit: this.max_digit})
  }

}
