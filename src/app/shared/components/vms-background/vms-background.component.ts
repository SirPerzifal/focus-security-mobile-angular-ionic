import { Component, OnInit } from '@angular/core';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-vms-background',
  templateUrl: './vms-background.component.html',
  styleUrls: ['./vms-background.component.scss'],
})
export class VmsBackgroundComponent  implements OnInit {

  constructor(private mainVmsService: MainVmsService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.onLoadBackground()
  }

  showImage = `assets/img/focus_logo-removebg.png`
  
  async onLoadBackground() {
    this.functionMain.vmsPreferences().then((value) => {
      if (value) {
        if (value.config.background) {
          this.showImage = this.functionMain.getImage(value.config.background)
        } else {
          this.showImage = value.config.is_windows ? `assets/img/focus_logo-removebg.jpeg` :  `assets/img/focus_logo-removebg.png`
        }
      } 
    })
  }

}
