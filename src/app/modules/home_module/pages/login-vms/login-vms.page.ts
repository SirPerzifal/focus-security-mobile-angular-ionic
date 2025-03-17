import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Html5Qrcode } from 'html5-qrcode';
import { Platform } from '@ionic/angular';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login-vms',
  templateUrl: './login-vms.page.html',
  styleUrls: ['./login-vms.page.scss'],
})
export class LoginVmsPage implements OnInit {

  constructor(
    private router: Router, 
    private platform: Platform, 
    private mainVmsService: MainVmsService, 
    public functionMain: FunctionMainService,
  ) {
    
   }

  ngOnInit() {
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onClick() {
    // this.router.navigate(['/home-vms'])
    this.scanResult = ''
    this.isQrModal = true
    this.isListening = true
    this.startScanner()
  }

  onBack() {
    this.router.navigate([''])
    this.isListening = false
  }

  isQrModal = false
  closeModal() {
    this.stopScanner()
    this.isQrModal = false
    this.isListening = false
  }
  

  htmlScanner!: Html5Qrcode
  scannerId = 'reader'
  scanResult: string = ''
  startScanner(){

    const closeModalOnBack = () => {
        this.closeModal()
        window.removeEventListener('popstate', closeModalOnBack);
    };
    history.pushState({ modalOpen: true }, '');
    window.addEventListener('popstate', closeModalOnBack)

    console.log("HAI")
    this.scanResult = ''
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
            width: 400,
            height: 400,
          }
        },
        (decodedText) => {
          this.scanResult = decodedText
          this.closeModal()
          this.searchBarcode(this.scanResult)
          this.scanResult = ''
        },
        (errorMessage) => {
          console.log(errorMessage)
        }
        
      ).catch(err => console.log(err));
    }, 0)
    
  }

  stopScanner() {
    this.htmlScanner.stop().catch( err => console.log(err))
  }

  isListening = false;

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
      console.log(this.scanResult)
      this.closeModal()
      this.searchBarcode(this.scanResult)
      this.scanResult = '';
    } else {
      if (timeDiff < this.scanThreshold) {
        this.scanResult += this.ignored_string
        this.scanResult += event.key;
        this.ignored_string = ''
      } else {
        this.ignored_string = event.key
        console.log('Ignored human typing:', event.key);
      }
    }

  }

  searchBarcode(barcode: string){
    console.log(barcode)
    console.log("HOY OVER HER WORK")
    if (barcode) {
      this.mainVmsService.getApi({barcode: barcode}, '/vms/post/vms_login').subscribe({
        next: (results) => {
          console.log(results.result)
          if (results.result.status_code === 200) {
            this.project_key = ''
            Preferences.set({
              key: 'USER_INFO',
              value: JSON.stringify(results.result.response_status.access_token),
            }).then(()=>{
              this.router.navigate(['/home-vms']);
            });
          } else {
            this.functionMain.presentToast('Residence codes not found!', 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while logging into VMS!', 'danger');
          console.error(error);
        }
      });
    } else {
      this.functionMain.presentToast('Project code is required!', 'warning')
    }
    
  }

  project_key = ''
}
