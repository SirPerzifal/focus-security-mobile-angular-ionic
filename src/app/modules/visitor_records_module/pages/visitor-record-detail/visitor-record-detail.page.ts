import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VisitorService } from 'src/app/service/vms/visitor/visitor.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-visitor-record-detail',
  templateUrl: './visitor-record-detail.page.html',
  styleUrls: ['./visitor-record-detail.page.scss'],
})
export class VisitorRecordDetailPage implements OnInit {

  constructor(private paramsActiveFromCoaches: ActivatedRoute, private visitorService: VisitorService, private toastController: ToastController, private router: Router) { }
  walkIn = false;
  driveIn = false;
  

  ngOnInit() {
    const snapshot = this.paramsActiveFromCoaches.snapshot.queryParams;
    console.log('Snapshot params:', snapshot);

    // Then subscribe to handle any future changes
    this.paramsActiveFromCoaches.queryParams.subscribe(params => {
      // Explicitly convert to boolean
      this.driveIn = params['driveIn'] === 'true' || params['driveIn'] === true;
      this.walkIn = params['walkIn'] === 'true' || params['walkIn'] === true;

      console.log('Drive In (after conversion):', this.driveIn);
      console.log('Walk In (after conversion):', this.walkIn);
    });
    // this.paramsActiveFromCoaches.queryParams.subscribe(params => {
    //   console.log(params);
    //   console.log('paramsparamsparamsparamsparams');
      
    //   this.driveIn = params['driveIn'];
    //   this.walkIn = params['walkIn']; 
    //   console.log(this.driveIn);
    //   console.log(this.walkIn);
    //   console.log('this.driveInthis.walkInthis.driveInthis.walkInthis.driveInthis.walkInthis.driveInthis.walkIn');
      
    //   // Atur showDrive menjadi true jika parameter ada
    //   // if (params['driveIn']) {  // Gunakan bracket notation di sini
    //   // }else if(params['walkIn']){
    //   //   this.driveIn = false;
    //   //   this.walkIn = true;
    //   // }
    // });
  }

}
