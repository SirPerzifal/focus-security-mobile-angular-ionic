import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-vms-background',
  templateUrl: './vms-background.component.html',
  styleUrls: ['./vms-background.component.scss'],
})
export class VmsBackgroundComponent  implements OnInit {

  constructor(public functionMain: FunctionMainService, private storage: StorageService, private platform: Platform) { }

  ngOnInit() {
    this.onLoadBackground()
    this.initializeBackButtonHandling();
  }

  showImage = `assets/img/focus_logo-removebg.png`
  
  async onLoadBackground() {
    this.storage.getValueFromStorage('USESATE_DATA').then(value => {
      console.log(value)
      if (value) {
        if (value.background) {
          this.showImage = this.functionMain.getImage(value.background)
        } else {
          this.showImage = `assets/img/focus_logo-removebg.png`
        }
      } 
    })
  }

  initializeBackButtonHandling() {
    console.log("tes");
    this.platform.backButton.subscribeWithPriority(10, () => {
      history.back();
    });
  }

}
