import { Component, OnInit } from '@angular/core';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-vms-background',
  templateUrl: './vms-background.component.html',
  styleUrls: ['./vms-background.component.scss'],
})
export class VmsBackgroundComponent  implements OnInit {

  constructor(private mainVmsService: MainVmsService) { }

  ngOnInit() {
    this.onLoadBackground()
  }

  showImage = `assets/img/focus_logo-removebg.png`
  
  onLoadBackground() {
    let params = {
      project_id: 1
    }
    this.mainVmsService.getApi(params, '/vms/get/project_background').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code === 200) {
          this.showImage = `data:image/png;base64,${results.result.response_result}`
        } else {
          this.showImage = `assets/img/focus_logo-removebg.png`
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
