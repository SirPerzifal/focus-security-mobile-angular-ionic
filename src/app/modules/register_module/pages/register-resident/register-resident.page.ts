import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { RegisterService } from 'src/app/service/resident/register-resident/register.service';

@Component({
  selector: 'app-register-resident',
  templateUrl: './register-resident.page.html',
  styleUrls: ['./register-resident.page.scss'],
})
export class RegisterResidentPage implements OnInit {

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private toastController:ToastController,
    private blockUnitService:BlockUnitService,
    private RegisterService:RegisterService
  ) { }

  Block: any[] = [];
  Unit: any[] = [];
  project_id: number = 0;

  formData = {
    full_name: '',
    nickname: '',
    email_address: '',
    mobile_number: '',
    block: '',
    unit: '',
    family_type: ''
  };

  onBlockChange(event: any) {
    this.formData.block = event.target.value;
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit = event.target.value;
  }

  loadBlock() {
    this.blockUnitService.getBlockRegister(this.project_id).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
          this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.formData.unit = ''
    this.blockUnitService.getUnit(this.formData.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result;
        } else {
          this.presentToast('An error occurred while loading unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  onSubmitRegister() {
    console.log(this.formData)
    let errMsg = ""
    if (!this.formData.full_name) {
      errMsg += 'Full Name is required!\n';
    }
    if (!this.formData.nickname) {
      errMsg += 'Nickname is required!\n';
    }
    if (!this.formData.mobile_number) {
      errMsg += 'Mobile Number is required!\n';
    }
    if (!this.formData.email_address) {
      errMsg += 'Email Address is required!\n';
    }
    if (!this.formData.block || !this.formData.unit) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if (!this.formData.family_type) {
      errMsg += 'Family Type is required!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    try {
      this.RegisterService.postRegister(this.formData.full_name, this.formData.nickname, this.formData.email_address, this.formData.mobile_number, this.formData.block, this.formData.unit, this.formData.family_type).subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200) {

            this.router.navigate(['login-end-user'])
            this.presentToast('Please wait for approval', 'success');
          } else {
            this.presentToast(res.result.status_desc, 'danger');
            console.log(res.result);
          }

        },
        error => {
          console.error('Error Here:', error);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.project_id = params['projectId']
    });
    this.loadBlock();
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['projectId']){
          console.log(params['projectId']);
          console.log("params['projectId']params['projectId']params['projectId']");
          
          // this.loadRecordsWheelClamp('wheel_clamp')
        }else{
          this.presentToast('The Chosen Project from previous page has failed to load here', 'danger')
        }
      }else{
        this.presentToast('The Chosen Project from previous page has failed to load here', 'danger')
      }
    })
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present()
  }

}
