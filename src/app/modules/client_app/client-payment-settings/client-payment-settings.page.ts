import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-payment-settings',
  templateUrl: './client-payment-settings.page.html',
  styleUrls: ['./client-payment-settings.page.scss'],
})
export class ClientPaymentSettingsPage implements OnInit {

  constructor(
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private router: Router
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
      this.loadPaymentMethod()
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_id = 0
  isLoading = false

  Method = [
    {value: 'manual_payment', text: 'Manual Payment'},
    {value: 'payment_gateway', text: 'Payment Gateway'},
    {value: 'both',text: 'Both'}
  ]

  paymentConfig: any = []
  paymentChange: any = []
  config: any = []
  async loadPaymentMethod(){
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id}, '/client/get/payment_method').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.paymentConfig = results.result.config
          this.paymentChange = this.paymentConfig
          console.log(this.paymentConfig)
        }
        this.isLoading = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get payment config!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  saveChanges() {
    console.log(this.paymentChange)
    this.clientMainService.getApi(this.paymentChange, '/client/post/payment_method').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.paymentConfig = this.paymentChange 
          console.log(this.paymentConfig)
          this.functionMain.presentToast('Payment method successfully updated!', 'success');
        } else {
          this.functionMain.presentToast('An error occurred while trying to update payment method!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to update payment method!', 'danger');
        console.error(error);
      }
    });
  }

  onBack() {
    this.router.navigate(['/client-main-app'], )
  }

  @ViewChild('clientPaymentMethodChange') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    console.log(event.target.files)
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.paymentChange.payment_qr_code = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  handleRefresh(event: any) {
    this.loadPaymentMethod().then(() => event.target.complete())
  }

}
