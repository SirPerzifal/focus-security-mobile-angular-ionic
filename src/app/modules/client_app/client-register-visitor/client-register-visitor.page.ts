import { Component, OnInit } from '@angular/core';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-register-visitor',
  templateUrl: './client-register-visitor.page.html',
  styleUrls: ['./client-register-visitor.page.scss'],
})
export class ClientRegisterVisitorPage implements OnInit {

  constructor(
    private clientMainService: ClientMainService,
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {
  }

  formData = {
    name: '',
    company_name: '',
    contact_number: '',
    selection_type: '',
    vehicle_number: '',
  }

  onSubmit() {
    let errMsg = ''
    if (this.formData.name == ''){
      errMsg += 'Name is required!'
    }
    if (this.formData.company_name == ''){
      errMsg += 'Company name is required!'
    }
    if (this.formData.contact_number == ''){
      errMsg += 'Contact number is required!'
    }
    if (this.formData.vehicle_number == '' && this.formData.selection_type == 'drive_in'){
      errMsg += 'Vehicle number is required!'
    }
    console.log(this.formData)
    if (errMsg != '') {

    } else {
      this.clientMainService.getApi(this.formData, '/client/post/add_ma_visitor').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.status_code === 200) {
            this.functionMain.presentToast(`Success!`, 'success');
          } else {
            this.functionMain.presentToast(`Failed!`, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('Failed!', 'danger');
          console.error(error);
        }
      });
    }
    
    
  }

}
