import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-resident-car-list',
  templateUrl: './resident-car-list.page.html',
  styleUrls: ['./resident-car-list.page.scss'],
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
export class ResidentCarListPage implements OnInit {

  constructor(
    private toastController: ToastController,
  ) { }

  searchType: string = ''; 

  vehicleRecords = [
    {
      id:43, 
      name:'Ashwinder',
      contact:'89436309',
      block:'100',
      unit:'08-33',
      vehicle: 'SMK 5848D', 
      vehicleType: '1st Vehicle', 
      lastEntry: '03/12/2024, 1710 Hrs', 
      firstWarning:{
        reason:'',
        image:null as File | null
      },
      secondWarning:{
        reason:'',
        image:null as File | null
      },
      clamp:{
        reason:'',
        beforeImage:null as File | null,
        afterImage:null as File | null
      }
    },
      
  ];
  showSearch:boolean = true;
  showList:boolean = false;
  showWarning:boolean = false;
  showClamp:boolean = false;
  showNricConfirm:boolean = false;
  nricConfirm:string='';
  activeRecord:number=0;
  currentActiveIssue:string='';
  currentWarningFile = null as File | null;
  beforeClampImageFile = null as File | null;
  afterClampImageFile = null as File | null;


  isButtonPressed = false;
  selectedReason: string = '';
  imageWarningInput: string = '';
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  canNricConfirm:boolean = false;

  onClickBackToMain(){
    this.selectedReason = '';
    this.imageWarningInput = '';
    this.imageBeforeClampInput = '';
    this.imageAfterClampInput = '';
    this.canNricConfirm = false;
    this.showSearch = true;
    this.showList = false;
    this.showWarning = false;
    this.showClamp = false;
    this.showNricConfirm = false;
    this.nricConfirm='';
    this.activeRecord=0;
    this.currentActiveIssue='';
    this.currentWarningFile = null as File | null;
    this.beforeClampImageFile = null as File | null;
    this.afterClampImageFile = null as File | null;
  }

  onButtonPress() {
    console.log('onButtonPressonButtonPressonButtonPressonButtonPress');
    
    this.isButtonPressed = true;
  }

  onButtonRelease() {
    console.log('onButtonReleaseonButtonReleaseonButtonReleaseonButtonRelease');
    this.isButtonPressed = false;
  }


  toggleShowSearch(){
    setTimeout(() => {
      this.showSearch = true;
      this.showList = true;
    }, 300)
  }

  toggleShowFirstWarning(selectedRecord:any){
    this.showWarning = true;
    this.showSearch = false;
    this.showList = false;
    this.activeRecord = selectedRecord.id
    this.currentActiveIssue = 'first_warning'
  }

  toggleShowSecondWarning(currentRecord:any){
    if(currentRecord.firstWarning.image!=null){
      this.showWarning = true;
      this.showSearch = false;
      this.showList = false;
      this.activeRecord = currentRecord.id
    this.currentActiveIssue = 'second_warning'
  }else{
      this.presentToast("Car must be only issued with just first warning before issueing second warning!","danger")
    }
  }

  toggleClampVehicle(currentRecord:any){
    this.showClamp = true;
    this.showSearch = false;
    this.showList = false;
    this.activeRecord = currentRecord.id
    this.currentActiveIssue = 'clamp'
  }

  onCancelWarning(){
    if(!this.showNricConfirm){
      this.showWarning = false;
      this.showSearch = true;
      this.showList = true;
      this.activeRecord = 0;
      this.currentWarningFile = null as File | null;
      this.selectedReason = '';
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    

    toast.present().then(() => {
      
      
    });
  }

  onCancelClamp(){
    if(!this.showNricConfirm){
      this.showClamp = false;
      this.showSearch = true;
      this.showList = true;
      this.currentWarningFile = null as File | null;
      this.selectedReason = '';
    }
  }

  onSubmitImage(){
    if(this.showWarning && this.selectedReason && this.imageWarningInput && !this.showNricConfirm){
      this.showNricConfirm=true;
    }else if(this.showClamp && this.selectedReason && this.beforeClampImageFile && this.afterClampImageFile && !this.showNricConfirm){
      this.showNricConfirm=true;
    }
  }

  onSubmitNric(){
    if(this.showNricConfirm && this.nricConfirm){
      this.showNricConfirm=false;
      this.showWarning=false;
      this.showClamp=false;
      this.showList = true;
      
      
      
      
      // this.vehicleRecords.filter(record => {
      //   record.id===this.activeRecord
      // }).map(record => {return {
      //   id:record.id, 
      //   name:record.name,
      //   contact:record.contact,
      //   block:record.block,
      //   unit:record.unit,
      //   vehicle: record.vehicle, 
      //   vehicleType: record.vehicleType, 
      //   lastEntry: record.lastEntry, 
      //   firstWarning:{
      //     reason: this.currentActiveIssue =='first_warning' ? this.selectedReason : record.firstWarning.reason,
      //     image:this.currentActiveIssue =='first_warning' ? this.currentWarningFile : record.firstWarning.image
      //   },
      //   secondWarning:{
      //     reason:this.currentActiveIssue =='second_warning' ? this.selectedReason : record.secondWarning.reason,
      //     image:this.currentActiveIssue =='second_warning' ? this.currentWarningFile : record.secondWarning.image
      //   },
      //   clamp:{
      //     reason:this.currentActiveIssue =='clamp' ? this.selectedReason : record.clamp.reason,
      //     beforeImage:this.currentActiveIssue =='clamp' ? this.beforeClampImageFile : record.clamp.beforeImage,
      //     afterImage:this.currentActiveIssue =='clamp' ? this.afterClampImageFile : record.clamp.afterImage
      //   }
      // }})
      var chosenRecord = this.vehicleRecords.map(record => record.id).indexOf(this.activeRecord)
      if(this.currentActiveIssue=='first_warning'){
        this.vehicleRecords[chosenRecord].firstWarning.reason = this.selectedReason
        this.vehicleRecords[chosenRecord].firstWarning.image = this.currentWarningFile
      }else if(this.currentActiveIssue=='second_warning'){
        this.vehicleRecords[chosenRecord].secondWarning.reason = this.selectedReason
        this.vehicleRecords[chosenRecord].secondWarning.image = this.currentWarningFile
      }else if(this.currentActiveIssue=='clamp'){
        this.vehicleRecords[chosenRecord].clamp.reason = this.selectedReason
        this.vehicleRecords[chosenRecord].clamp.beforeImage = this.beforeClampImageFile
        this.vehicleRecords[chosenRecord].clamp.afterImage = this.afterClampImageFile
      }
      this.activeRecord = 0;
      this.nricConfirm = '';
      this.canNricConfirm = false;
      this.selectedReason = '';
      this.currentWarningFile = null;
      this.beforeClampImageFile = null;
      this.afterClampImageFile = null;
      this.imageWarningInput = '';
      this.imageBeforeClampInput = '';
      this.imageAfterClampInput = '';

      console.log(this.vehicleRecords);
      console.log("this.vehicleRecordsthis.vehicleRecordsthis.vehicleRecordsthis.vehicleRecordsthis.vehicleRecordsthis.vehicleRecords");
      
    }
  }

  ngOnInit() {
  }

  onCancelNricConfirm(){
    this.showNricConfirm=false;
    this.nricConfirm='';
    this.canNricConfirm=false;
  }

  onNricConfirmChange(event:string){
    this.nricConfirm = event
    if(this.nricConfirm){
      this.canNricConfirm = true
    }else{
      this.canNricConfirm = false
    }
    
    
  }

  onWarningImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.currentWarningFile = file;
    this.imageWarningInput = file.name; // Or file.path if you need the full path
    
    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);
    
    // You can now use this formData for upload or further processing
  }

  onBeforeClampImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.beforeClampImageFile = file
    this.imageBeforeClampInput = file.name; // Or file.path if you need the full path
    console.log(this.imageBeforeClampInput);
    console.log('imageBeforeClampInputimageBeforeClampInputimageBeforeClampInputimageBeforeClampInput');
    
    
    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);
    
    // You can now use this formData for upload or further processing
  }

  onAfterClampImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.afterClampImageFile = file
    this.imageAfterClampInput = file.name; // Or file.path if you need the full path
    console.log(this.imageAfterClampInput);
    console.log('this.imageAfterClampInputthis.imageAfterClampInputthis.imageAfterClampInputthis.imageAfterClampInput');
    
    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);
    
    // You can now use this formData for upload or further processing
  }



}
