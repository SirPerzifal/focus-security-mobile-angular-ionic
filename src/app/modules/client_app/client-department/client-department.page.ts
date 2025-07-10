import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-client-department',
  templateUrl: './client-department.page.html',
  styleUrls: ['./client-department.page.scss'],
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
export class ClientDepartmentPage implements OnInit {

  constructor(
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private router: Router,
    private webRtcService: WebRtcService
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.loadDepartment()
    })
  }

  project_id = 0
  department_name = ''

  onSubmit() {
    let errMsg = ''
    if (this.department_name == ''){
      errMsg += 'Profile image is required \n'
    }
        if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      this.clientMainService.getApi({name: this.department_name}, '/client/post/new_department').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.loadDepartment()
            this.onBack()
            this.functionMain.presentToast(`Successfully add new employee!`, 'success');
          } else {
            this.functionMain.presentToast(results.result.error_message, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast(error.result.error_message, 'danger');
          console.error(error);
        }
      });
    }
  }

  faArrow = faArrowRight

  resetForm() {
    this.department_name = ''
  }
  
  Department: any = []
  departmentDetail: any = {}
  isLoading = false
  async loadDepartment() {
    this.Department = []
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id, is_detail: true}, '/client/get/department').subscribe({
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
        this.isLoading = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to fetch department data!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  textSecond = ''

  isMain = true
  isDetail = false

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
    } else {
      this.isNew = false
      this.isDetail = false
      setTimeout(() => {
        this.isMain = true
      }, 300)
    }
  }

  
  viewDetail(department: any) {
    console.log(department)
    this.departmentDetail = department
    this.isMain = false
    setTimeout(() => {
      this.isDetail = true
      this.textSecond = ''
    }, 300)
  }

  isNew = false
  showNew() {
    this.isDetail = false
    this.isMain = false
    setTimeout(() => {
      this.isNew = true
      this.textSecond = ''
    }, 300)
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  handleRefresh(event: any) {
    this.loadDepartment().then(() => event.target.complete())
  }
  

}
