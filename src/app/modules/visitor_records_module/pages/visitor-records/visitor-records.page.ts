import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-visitor-records',
  templateUrl: './visitor-records.page.html',
  styleUrls: ['./visitor-records.page.scss'],
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
export class VisitorRecordsPage implements OnInit {

  constructor() { }

  searchType: string = ''; 
  isSearchTypeSelected: boolean = false;

  vehicleRecords = [
    { vehicle: 'SMK 5848D', purpose: 'Visiting', entry: '24/10/2024, 1404 Hrs', exit: '24/10/2024, 1434 Hrs' }
  ];
  showSearch = false;
  show48Hrs = false;
  show24Hrs = false;
  driveIn = false;
  walkIn = false;


  onSearchTypeChange(event: any) {
    this.searchType = event.target.value;
    this.isSearchTypeSelected = true;
    console.log(this.searchType)
  }

  toggleWalkIn(){
    if (!this.walkIn) {
      // this.showQrTrans = true
      // this.showDrive = false;
      // this.showWalk = false;
      setTimeout(() => {
        this.walkIn = true;
        this.driveIn = false
        if(this.searchType=='vehicle'){
          this.searchType = '';
          this.isSearchTypeSelected = false;
        }
      }, 300)
    }
  }

  toggleDriveIn(){
    if (!this.driveIn) {
      // this.showQrTrans = true
      // this.showDrive = false;
      // this.showWalk = false;
      setTimeout(() => {
        this.driveIn = true;
        this.walkIn = false
        if(this.searchType=='name'){
          this.searchType = '';
          this.isSearchTypeSelected = false;
        }
      }, 300)
    }
  }

  toggleShow48Hrs() {
    if (!this.show48Hrs) {
      // this.showQrTrans = true
      // this.showDrive = false;
      // this.showWalk = false;
      setTimeout(() => {
        this.show48Hrs = true;
        this.show24Hrs = false
      }, 300)
    }
  }

  toggleShow24Hrs() {
    if (!this.show24Hrs) {
      // this.showWalkTrans = true
      // this.showDrive = false;
      // this.showQr = false;
      setTimeout(() => {
        this.show24Hrs = true;
        this.show48Hrs = false
      }, 300)
    }
  }

  toggleShowSearch(){
    if (!this.showSearch) {
      setTimeout(() => {
        this.showSearch = true;
        this.walkIn = true;
        this.driveIn = false
        this.isSearchTypeSelected = false;
      }, 300)
    }else{
      setTimeout(() => {
        this.showSearch = false;
        this.walkIn = false;
        this.driveIn = true
        this.isSearchTypeSelected = false;
      }, 300)
    }
  }

  ngOnInit() {
  }

}
