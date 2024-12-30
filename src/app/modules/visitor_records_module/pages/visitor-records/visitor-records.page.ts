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
    this.walkIn = true;
    this.driveIn = false
    if(this.searchType=='vehicle'){
      this.searchType = '';
      this.isSearchTypeSelected = false;
    }
  }

  toggleDriveIn(){
    this.driveIn = true;
    this.walkIn = false
    if(this.searchType=='name'){
      this.searchType = '';
      this.isSearchTypeSelected = false;
    }
  }

  toggleShow48Hrs() {
        this.show48Hrs = true;
        this.show24Hrs = false
      
  }

  toggleShow24Hrs() {
        this.show24Hrs = true;
        this.show48Hrs = false
  }

  toggleShowSearch(){
    if (!this.showSearch) {
      this.showSearch = true;
      setTimeout(() => {
        
        this.walkIn = true;
        this.driveIn = false
        this.isSearchTypeSelected = false;
      }, 300)
    }else{
      this.showSearch = false;
      setTimeout(() => {
        
        this.walkIn = false;
        this.driveIn = true
        this.isSearchTypeSelected = false;
      }, 300)
    }
  }

  ngOnInit() {
  }

}
