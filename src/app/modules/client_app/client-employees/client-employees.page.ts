import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-client-employees',
  templateUrl: './client-employees.page.html',
  styleUrls: ['./client-employees.page.scss'],
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
export class ClientEmployeesPage implements OnInit {

  constructor(
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private router: Router,
    private alertController: AlertController,
    private getUserInfoService: GetUserInfoService,
    private webRtcService: WebRtcService
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.loadDepartment()
      this.loadEmployees()
    })
  }

  project_id = 0

  formData = {
    full_name: '',
    nickname: '',
    contact_number: '',
    email_address: '',
    image_family: '',
    department_id: '',
    rfid_number: '',
    card_number: '',
    extension_number: '',
    vehicle_number: '',
    employee_code: '',
    employment_type: '',
  }

  @ViewChild('clientNewEmployeeProfile') fileInput!: ElementRef;
  onImageClick() {
    this.fileInput?.nativeElement.click();
  }

  selectedImageName = ''
  onImageChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedImageName = data.name; // Store the selected file name
      this.functionMain.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.image_family = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedImageName = ''; // Reset if no file is selected
    }
  }


  onSubmit() {
    console.log(this.formData)
    let errMsg = ''
    if (this.formData.image_family == ''){
      errMsg += 'Profile image is required \n'
    }
    if (this.formData.full_name == ''){
      errMsg += 'Full name is required! \n'
    }
    if (this.formData.employment_type == ''){
      errMsg += 'Employment type is required! \n'
    }
    // if (this.formData.nickname == ''){
    //   errMsg += 'Nickname is required \n'
    // }
    if (this.formData.department_id == ''){
      errMsg += 'Department is required \n'
    }
    if (this.formData.employee_code == ''){
      errMsg += 'Employee code is required! \n'
    }
    // if (this.formData.vehicle_number == ''){
    //   errMsg += 'Vehicle number is required! \n'
    // }
    if (this.formData.email_address == ''){
      errMsg += 'Email address is required \n'
    }
    if (this.formData.contact_number == ''){
      errMsg += 'Contact number is required \n'
    }
    if (this.formData.contact_number) {
      if (this.formData.contact_number.length <= 2 ) {
        errMsg += 'Contact number is required \n \n'
      }
    }
    if (this.formData.extension_number == ''){
      errMsg += 'Extension number is required! \n'
    }
    if (this.formData.card_number == ''){
      errMsg += 'Card number is required! \n'
    }
    // if (this.formData.rfid_number == ''){
    //   errMsg += 'Rfid number is required! \n'
    // }
    console.log(this.formData)
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      this.clientMainService.getApi(this.formData, '/client/post/add_new_employee').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.status_code === 200) {
            this.loadEmployees()
            // this.toggleShowActive()
            this.toggleShowActive()
            this.functionMain.presentToast(`Successfully add new employee!`, 'success');
          } else {
            this.functionMain.presentToast(results.result.status_description, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast(error.result.status_description, 'danger');
          console.error(error);
        }
      });
    }
  }

  faArrow = faArrowRight
  today = new Date().setHours(0,0,0,0)

  resetForm() {
    this.formData = {
      full_name: '',
      nickname: '',
      contact_number: '',
      email_address: '',
      image_family: '',
      department_id: '',
      rfid_number: '',
      card_number: '',
      extension_number: '',
      vehicle_number: '',
      employee_code: '',
      employment_type: '',
    }
    this.selectedImageName = ''
  }
  
  Department: any = []
  isLoading = false
  loadDepartment() {
    this.clientMainService.getApi({project_id: this.project_id}, '/client/get/department').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.results.length > 0){
            this.Department = results.result.results
          } else {
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to fetch department data!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to fetch department data!', 'danger');
        console.error(error);
      }
    });
  }

  async loadEmployees() {
    this.isLoading = true
    let params = {
      record_list: 'employee', 
      project_id: this.project_id, 
      is_approved: true,
      page: this.currentPage, 
      limit: this.functionMain.limitHistory, 
      name: this.nameFilter,
    }
    this.showVisitorList = []
    this.clientMainService.getApi(params, '/client/get/approval_list').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
            this.showVisitorList = results.result.booking
            this.pagination = results.result.pagination
        } else {
          this.functionMain.presentToast(`Failed!`, 'danger');
          this.pagination = {}
        }
        this.isLoading = false
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  textSecond = 'Active Employees'

  isActive = true
  isNew = false
  isNewTrans = false
  isMain = true
  isDetail = false

  toggleShowActive() {
    this.isActive = true
    this.isNew = false
    this.textSecond = 'Active Employees'
    this.resetForm()
  }

  toggleShowNew() {
    this.isActive = false
    this.isNew = true
    this.textSecond = 'New Employee'
  }

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.isDetail = false
      setTimeout(() => {
        this.textSecond = this.isActive ? 'Active Visitor'  : 'New Visitor'
        this.isMain = true
      }, 300)
    }
  }

  showVisitorList: any = []
  visitorList: any = []
  
  viewDetail(visitor: any) {
    console.log(visitor)
    this.visitorDetail = visitor
    this.isMain = false
    setTimeout(() => {
      this.isDetail = true
      this.textSecond = 'Employee Detail'
    }, 300)
  }

  visitorDetail: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  callEmployee(data: any){
    // console.log(data)
    this.webRtcService.createOffer(false, data.id, false, false);
  }

  nameFilter = ''

  onNameFilterChange(event: any) {
    this.nameFilter = event.target.value
    this.applyFilter()
  }

  clearFilters() {
    this.nameFilter = ''
    this.applyFilter()
  }

  applyFilter() {
    this.currentPage = 1
    this.inputPage = 1
    this.loadEmployees()
  }

  handleRefresh(event: any) {
    this.loadEmployees().then(() => event.target.complete())
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadEmployees()
  }

}
