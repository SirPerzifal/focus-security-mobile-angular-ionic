import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { VisitorService } from 'src/app/services/visitor/visitor.service';

@Component({
  selector: 'app-walk-in',
  templateUrl: './walk-in.page.html',
  styleUrls: ['./walk-in.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class WalkInPage implements OnInit {

  constructor(private paramsActiveFromCoaches: ActivatedRoute, private visitorService: VisitorService) { }

  formData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: 'Block 1',
    unit: 'Unit 1'
  };

  onSubmitDriveIn() {
    console.log(this.formData)
    this.visitorService.postAddVisitor(this.formData.visitor_name, this.formData.visitor_contact_no, 'drive_in', '', this.formData.block, this.formData.unit).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  onSubmitWalkIn() {
    console.log(this.formData)
    this.visitorService.postAddVisitor(this.formData.visitor_name, this.formData.visitor_contact_no, 'walk_in', '', this.formData.block, this.formData.unit).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  showWalk = false;
  showDrive = false;
  showQr = false;
  showWalkTrans = false;
  showDriveTrans = false;
  showQrTrans = false;

  toggleShowQr() {
    if (!this.showDriveTrans && !this.showWalkTrans){
      this.showQrTrans = true
      this.showDrive = false;
      this.showWalk = false;
      setTimeout(()=>{
        this.showQr = true;
        this.showQrTrans = false
      }, 300)
    }
  }

  toggleShowWalk() {
    if (!this.showQrTrans && !this.showDriveTrans){
      this.showWalkTrans = true
      this.showDrive = false;
      this.showQr = false;
      setTimeout(()=>{
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showQrTrans && !this.showWalkTrans){
      this.showDriveTrans = true
      this.showWalk = false;
      this.showQr = false;
      setTimeout(()=>{
        this.showDrive = true;
        this.showDriveTrans = false
      }, 300)
    }
  }

  ngOnInit() {
    this.paramsActiveFromCoaches.queryParams.subscribe(params => {
      if (params['showDrive']) {  // Gunakan bracket notation di sini
        this.showDrive = true; // Atur showDrive menjadi true jika parameter ada
      }
    });
  }

}
