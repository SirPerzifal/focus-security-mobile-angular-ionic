import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vms-checkout',
  templateUrl: './vms-checkout.page.html',
  styleUrls: ['./vms-checkout.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class VmsCheckoutPage implements OnInit {

  constructor(
    private router: Router,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {
  }

  isMain = true
  isSearch = false

  onBack() {
    if (!this.isMain) {
      this.resetForm()
      this.isSearch = false
      setTimeout(() => {
        this.logData = {}
        this.isMain = true
      }, 300)
    } else {
      this.router.navigate(['/home-vms'])
    }
  }

  checkoutForm = {
    identification_type: '',
    identification_number: '',
    contact_number: '',
    pass_number: '',
  }

  resetForm() {
    this.checkoutForm = {
      identification_type: '',
      identification_number: '',
      contact_number: '',
      pass_number: '',
    }
  }

  setFromScan(event: any) {
    console.log(event)
    this.checkoutForm.identification_number = event.data.identification_number
    this.checkoutForm.identification_type = event.type
    console.log(this.checkoutForm.identification_type, this.checkoutForm.identification_number)
  }

  selectedNric = ''

  logData: any = {}
  searchData(data_include: string = '') {
    console.log(this.checkoutForm)
    let params = {...this.checkoutForm}
    if (data_include == 'is_id') {
      params.contact_number = ''
      params.pass_number = ''
    }
    if (data_include == 'is_contact') {
      params.identification_number = ''
      params.pass_number = ''
    }
    if (data_include == 'is_pass') {
      params.contact_number = ''
      params.identification_number = ''
    }
    console.log(params)
    if (!params.contact_number && !params.identification_number && !params.pass_number) {
      this.functionMain.presentToast('At least one field must be filled!', 'danger')
      return
    }
    this.clientMainService.getApi({...params, is_search_all: data_include == 'is_all'}, '/vms/get/log_by_spec').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.logData = results.result.response_result[0]
          this.isMain = false
          setTimeout(() => {
            this.isSearch = true
          }, 300);
        } else if (results.result.response_code === 401) {
          this.functionMain.presentToast('No data found!', 'danger');

        } else {
          this.functionMain.presentToast('An error occurred while trying to searching the data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to searching the data!', 'danger');
        console.error(error);
      }
    });
  }

  onCheckout() {
    console.log(this.logData)
    this.clientMainService.getApi({id: this.logData.id}, '/vms/post/log_checkout').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast('Successfully checkout the data!', 'success');
          this.onBack()
        } else {
          this.functionMain.presentToast('An error occurred while trying to checkout this data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to checkout this data!', 'danger');
        console.error(error);
      }
    });
  }

  faSearch = faSearch
}
