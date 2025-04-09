import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RegisterService } from 'src/app/service/resident/register-resident/register.service';

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
    private registerService: RegisterService,
    private functionMain: FunctionMainService,
    private router: Router,
  ) { }
  projectList: ProjectData[] = [];
  projectCode: string = '';
  selectedOption: any = null;  // To store the selected option

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.loadProjects()
  }

  loadProjects(){
    this.registerService.getProjectList().subscribe({
      next: (response: any) => {
        if (response.result.response_code === 200) {
          this.projectList = response.result.projects.map((project:any)=>({
            id:project.id,
            name: project.code + ' - ' + project.project_name,
            code:project.code
          }));
        } else {
          this.functionMain.presentToast('An error occurred while loading project data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading project data!', 'danger');
      }
    })
  }

  async onRegisterResident(){
    if(this.projectCode){
      let filteredObject = this.projectList.find(projectObj => projectObj.code === this.projectCode)
      if(filteredObject){
        this.router.navigate(['/register-resident'], {queryParams: { projectId: filteredObject.id }})
      }else{
        this.functionMain.presentToast('Your Location Code is invalid!', 'danger');
      }
      
    }else{
      this.functionMain.presentToast('Please enter a Location Code!', 'danger');
    }
  }

  async onRegisterCommercial(){
    if(this.projectCode){
      // this.router.navigate(['/register-commercial'], {queryParams: { projectId: this.selectedOption.id }})
      let filteredObject = this.projectList.find(projectObj => projectObj.code === this.projectCode)
      if(filteredObject){
        this.router.navigate(['/register-commercial'], {queryParams: { projectId: filteredObject.id }})
      }else{
        this.functionMain.presentToast('Your Location Code is invalid!', 'danger');
      }
    }else{
      this.functionMain.presentToast('Please enter a Location Code!', 'danger');
    }
  }


  onOptionSelected(option: any) {
    this.selectedOption = option;  // Store the selected option
  }
}
