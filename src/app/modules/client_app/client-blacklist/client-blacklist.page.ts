import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-client-blacklist',
  templateUrl: './client-blacklist.page.html',
  styleUrls: ['./client-blacklist.page.scss'],
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
export class ClientBlacklistPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private blockUnitService: BlockUnitService,
    private alertController: AlertController,
    private mainVmsService: MainVmsService,
    private getUserInfoService: GetUserInfoService,
    private webRtcService: WebRtcService
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id != null ? value.project_id : 751;
      this.project_config = value.config
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
      this.loadBlacklistData()
    })
    
  }

  project_id = 0
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isVisitor = true
  isVehicle = false
  isNew = false
  isMain = true
  isDetail = false
  showTrans = true
  textSecond = 'Visitor'

  onBack(){
    if (this.isMain) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.isDetail = false
      setTimeout(() => {
        this.isMain = true
        this.blacklistDetail = []
        this.ban_image = ''
      }, 300)
    }
  }

  params: any
  pageType = 'visitor'

  toggleSlide(type: string) {
    if (type != this.pageType) {
      this.searchOption = ''
      this.filter = {
        vehicle_number: '',
        name: '',
        contact: '',
        issue_date: ''
      }
      this.clearForm()
    }
    if (type == 'visitor') {
      this.isNew = false
      this.isVisitor = true
      this.isVehicle = false
      this.textSecond = 'Visitor'
      this.pageType = 'visitor'
      this.blacklistData = this.existData.filter(item => item.vehicle_no == '')
    }
    if (type == 'vehicle') {
      this.isNew = false
      this.isVisitor = false
      this.isVehicle = true
      this.textSecond = 'Vehicle'
      this.pageType = 'vehicle'
      this.blacklistData = this.existData.filter(item => item.vehicle_no != '')
    }
    if (type == 'new_data') {
      this.isVisitor = false
      this.isVehicle = false
      this.isNew = true
      this.textSecond = 'New Data'
      this.pageType = 'new_data'
    }
    console.log(this.blacklistData)
  }

  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  existData: any[] = []
  blacklistData: any[] = []
  searchOption: string = ''

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  onDateChange(event: any) {
    console.log(event.target.value)
    this.filter.issue_date = event.target.value;
    this.applyFilters()
  }

  onVehicleFilterChange(event: any) {
    this.filter.vehicle_number = event.target.value
    this.applyFilters()
  }

  onNameFilterChange(event: any) {
    this.filter.name = event.target.value
    this.applyFilters()
  }

  onContactFilterChange(event: any) {
    this.filter.contact = event.target.value
    console.log(this.filter.contact)
    this.applyFilters()
  }

  Block: any[] = []
  Unit: any[] = []

  filter = {
    name: '',
    vehicle_number: '',
    issue_date: '',
    contact: '',
  }


  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  onSearchOptionChange(event: any) {
    this.searchOption = event.target.value
    console.log(event.target.value)
  }

  startDateFilter = ''

  clearFilters() {
    this.searchOption = ''
    this.filter.name = ''
    this.filter.vehicle_number = ''
    this.filter.contact = ''
    this.applyFilters() 
  }


  applyFilters() {
    this.blacklistData = this.existData.filter(item => {
      const typeMatches = this.pageType == 'vehicle' ? item.vehicle_no != '' : item.vehicle_no == '';
      const contactMatches = this.filter.contact ? item.contact_no.includes(this.filter.contact) : true;
      const vehicleNumberMatches = this.pageType == 'vehicle' ? ( this.filter.vehicle_number ? item.vehicle_no.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true ) : ( this.filter.name ? item.visitor_name.toLowerCase().includes(this.filter.name.toLowerCase()) : true );

      return typeMatches && contactMatches && vehicleNumberMatches;
    });
    console.log(this.blacklistData)
  }

  onArrowClick(vehicle: any[]) {
    this.router.navigate(['records-wheel-clamped-detail'], {
      state: {
        vehicle: vehicle,
      },
      queryParams: this.params
    });
  }

  isLoading = false
  async loadBlacklistData() {
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id}, '/vms/get/visitor_ban').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.response_code === 200) {
          this.existData = results.result.result;
          // this.blacklistData = this.existData.filter(item => item.vehicle_no == '')
          this.applyFilters()
        } else {
        }
      },
      error: (error) => {
        this.isLoading = false
        this.presentToast('An error occurred while loading blacklist data!', 'danger');
        console.error(error);
      }
    });
  }

  // onNewData() {
  //   this.router.navigate(['/records-blacklist-form'])
  // }

  onClickDetail(record: any) {
    this.router.navigate(['/records-blacklist-detail'], {
      state: {
        record: record
      }
    })
  }

  onNewData() {
    console.log("NEW")
  }

  onBlockChange(event: any) {
    this.formData.block_id = event.target.value;
    this.choosenBlock = event.target.value
    this.Unit = []
    this.loadUnit()
    console.log(this.formData.block_id)
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event[0];
    console.log(this.formData.unit_id)
  }

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  choosenBlock = ''

  async loadUnit() {
    this.formData.unit_id = ''
    this.blockUnitService.getUnit(this.choosenBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        console.error('Error:', error.result);
      }
    });
  }

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.formData.vehicle_no = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  saveRecord() {
    let errMsg = ''
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor name is required! \n'
    }
    // if (!this.formData.vehicle_no) {
    //   errMsg += 'Visitor vehicle number is required! \n'
    // }
    if (!this.formData.contact_no) {
      errMsg += 'Visitor contact number is required! \n'
    }
    if (this.formData.contact_no) {
      if (this.formData.contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.formData.reason) {
      errMsg += 'Reason of ban is required! \n'
    }
    if ((!this.formData.block_id || !this.formData.unit_id) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (!this.formData.host && this.project_config.is_industrial) {
      errMsg += 'Host must be selected! \n'
    }
    if (!this.formData.ban_image) {
      errMsg += 'Ban image is required! \n'
    }
    if (!this.formData.banned_by) {
      errMsg += 'Issue officer is required! \n'
    }
    if (errMsg != ''){
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      console.log("SAVE")
      let tempDate = new Date().toISOString().split('T')
      this.formData.last_entry_date_time = tempDate[0] + ' ' + tempDate[1].split('.')[0]
      console.log(this.formData)
      this.clientMainService.getApi(this.formData, '/resident/post/ban_visitor').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_status === 200) {
            this.functionMain.presentToast('Successfully create blacklist data!', 'success');
            this.loadBlacklistData()
            if (this.formData.vehicle_no) {
              this.toggleSlide('vehicle')
            } else {
              this.toggleSlide('visitor')
            }
            this.clearForm()
          } else {
            this.functionMain.presentToast('An error occurred while submitting blacklist data!', 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while submitting blacklist data!', 'danger');
          console.error(error);
        }
      });
    }
  }

  getContactInfo(contactData: any) {
    if (contactData) {
      this.formData.visitor_name = contactData.visitor_name
      this.formData.vehicle_no = contactData.vehicle_number
      this.formData.block_id = contactData.block_id
      this.loadUnit().then(() => {
        this.formData.unit_id = contactData.unit_id
      })
    }
  }

  clearForm(){
    this.formData = {
      reason: '',
      block_id: '',
      unit_id: '',
      host: '',
      contact_no: '',
      vehicle_no: '',
      visitor_name: '',
      last_entry_date_time: '',
      ban_image: '',
      banned_by: '',
    }
  }

  formData = {
    reason: '',
    block_id: '',
    unit_id: '',
    host: '',
    contact_no: '',
    vehicle_no: '',
    visitor_name: '',
    last_entry_date_time: '',
    ban_image: '',
    banned_by: '',
  };

  record: any

  onBanImage(file: File): void {
    let data = file;
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.formData.ban_image = base64.split(',')[1]
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } 
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  @ViewChild('clientBlacklistUploadImage') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name

      // Konversi file ke base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Hapus prefix data URL jika ada
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.formData.ban_image = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method untuk mengupload file (opsional, bisa dihapus jika tidak diperlukan)
  uploadFile() {
    if (this.selectedFile) {
      console.log(this.selectedFile)
      this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  ban_image =''

  blacklistDetail: any = []
  viewDetail(blacklist: any) {
    this.blacklistDetail = blacklist
    this.isMain = false
    this.ban_image = `data:image/png;base64,${blacklist.ban_image}`
    setTimeout(() => {
      this.isDetail = true
    }, 300)
  }

  async onLiftBan(data: any) {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to lift the ban?`,
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.liftBanProc(data.id)
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  async liftBanProc(id: number) {
    this.mainVmsService.getApi({ id: id }, '/vms/post/lift_ban').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_status === 200) {
          this.functionMain.presentToast('Successfully lifted the ban!', 'success');
          this.loadBlacklistData()
          this.onBack()
        } else {
          this.functionMain.presentToast('An error occurred while attempting to lift the ban!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while attempting to lift the ban!', 'danger');
        console.error(error);
      }
    });
  }

  callResident(){
    console.log("black listttt -================", this.blacklistData);
    let copyData = this.blacklistData;
    // this.webRtcService.createOffer(copyData);
  }

  Host: any = []
  loadHost() {
    this.clientMainService.getApi({}, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.formData.host = event[0]
  }
}
