import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { RegisterService } from 'src/app/service/resident/register-resident/register.service';

@Component({
  selector: 'app-register-resident',
  templateUrl: './register-resident.page.html',
  styleUrls: ['./register-resident.page.scss'],
})
export class RegisterResidentPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private functionMain: FunctionMainService,
    private blockUnitService: BlockUnitService,
    private RegisterService: RegisterService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['projectId']){
          this.project_id = params['projectId']
          this.loadBlock();
        }else{
          this.functionMain.presentToast('The Chosen Project from previous page has failed to load here', 'danger')
        }
      }else{
        this.functionMain.presentToast('The Chosen Project from previous page has failed to load here', 'danger')
      }
    })
  }

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

  onFamilyTypeChange(event: any) {
    this.formData.family_type = event.target.value;
  }

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
          this.functionMain.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading block data!', 'danger');
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
          this.functionMain.presentToast('An error occurred while loading unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading unit data', 'danger');
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
    if (!this.formData.mobile_number && !this.formData.email_address) {
      errMsg += 'Mobile Number or Email Address is required!\n';
    }
    if (!this.formData.block || !this.formData.unit) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if (errMsg != "") {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    try {
      this.RegisterService.postRegister(this.formData.full_name, this.formData.nickname, this.formData.email_address, this.formData.mobile_number, this.formData.block, this.formData.unit, this.formData.family_type).subscribe(
        res => {
          if (res.result.status_code == 200) {
            this.formData = {
              full_name: '',
              nickname: '',
              email_address: '',
              mobile_number: '',
              block: '',
              unit: '',
              family_type: ''
            };

            this.router.navigate(['login-end-user'])
            this.functionMain.presentToast('Please wait for approval', 'success');
          } else {
            this.functionMain.presentToast(res.result.status_desc, 'danger');
            console.log(res.result);
          }

        },
        error => {
          console.error('Error Here:', error);
          this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
    }

  }
}
