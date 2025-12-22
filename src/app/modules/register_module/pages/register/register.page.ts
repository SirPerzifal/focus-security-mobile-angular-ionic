import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RegisterService } from 'src/app/service/resident/register-resident/register.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

interface ProjectData{
  id:number;
  name:string;
  code:string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private mainVms: MainVmsService,
    private functionMain: FunctionMainService,
    private router: Router,
  ) { }
  projectList: ProjectData[] = [];
  projectCode: string = '';
  selectedOption: any = null;  // To store the selected option

  ngOnInit() {
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  searchProject(){
    this.mainVms.getApi({code: this.projectCode}, '/residential/register/post/project').subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.result.response_code === 200) {
          if (response.result.result.is_success) {
            this.router.navigate(['/register-resident'], {queryParams: { projectId: response.result.result.project_id }})
          } else {
            this.functionMain.presentToast(response.result.result.message, 'danger');
          }
        } else {
          this.functionMain.presentToast('An error occurred while trying to check the location code!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to check the location code!', 'danger');
      }
    })
  }

}
