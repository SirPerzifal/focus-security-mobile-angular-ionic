import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/service/resident/register-resident/register.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private toastController: ToastController,
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
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading project data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading project data!', 'danger');
        console.error('Error:', error);
      }
    })
  }

  async onRegisterResident(){
    if(this.projectCode){
      let filteredObject = this.projectList.find(projectObj => projectObj.code === this.projectCode)
      if(filteredObject){
        this.router.navigate(['/register-resident'], {queryParams: { projectId: filteredObject.id }})
      }else{
        this.presentToast('Your Location Code is invalid!', 'danger');
      }
      
    }else{
      this.presentToast('Please enter a Location Code!', 'danger');
    }
  }

  async onRegisterCommercial(){
    if(this.projectCode){
      // this.router.navigate(['/register-commercial'], {queryParams: { projectId: this.selectedOption.id }})
      let filteredObject = this.projectList.find(projectObj => projectObj.code === this.projectCode)
      if(filteredObject){
        this.router.navigate(['/register-commercial'], {queryParams: { projectId: filteredObject.id }})
      }else{
        this.presentToast('Your Location Code is invalid!', 'danger');
      }
    }else{
      this.presentToast('Please enter a Location Code!', 'danger');
    }
  }


  onOptionSelected(option: any) {
    this.selectedOption = option;  // Store the selected option
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
  }

}
