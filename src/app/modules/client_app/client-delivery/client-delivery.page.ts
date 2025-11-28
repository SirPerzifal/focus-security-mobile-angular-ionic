import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-client-delivery',
  templateUrl: './client-delivery.page.html',
  styleUrls: ['./client-delivery.page.scss'],
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
export class ClientDeliveryPage implements OnInit {

  constructor(
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['type']){
          this.is_package = params['type'] == 'package'
          if (this.is_package) {
            this.page_name = 'Package Platform'
          }
        }
      }
    })
    this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.loadDelivery()
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  is_package = false
  page_name = 'Food Platform'

  project_id = 0

  onSubmit() {
    let errMsg = ''
    if (this.deliverySubmit.name == ''){
      errMsg += 'Name is required \n'
    }
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      this.clientMainService.getApi({...this.deliverySubmit, is_package: this.is_package}, '/client/post/new_delivery').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.selectedImageName = ''
            this.deliveryDetail = {...this.deliverySubmit}
            this.deliverySubmit = {}
            this.loadDelivery()
            this.onBack()
            this.functionMain.presentToast(`Successfully add new platform!`, 'success');
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
    this.deliverySubmit = {}
    this.selectedImageName = ''
  }
  
  Deliveries: any = []
  deliveryDetail: any = {}
  deliverySubmit: any = {}
  isLoading = false
  async loadDelivery() {
    this.Deliveries = []
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id, is_package: this.is_package}, '/client/get/delivery_platform').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.results.length > 0){
            this.Deliveries = results.result.results
          } else {
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to fetch delivery data!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to fetch delivery data!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  textSecond = ''

  isMain = true
  isDetail = false

  onBack() {
    if (this.isEdit) {
      this.isEdit = false
      this.isNew = false
      setTimeout(() => {
        this.resetForm()
        this.isDetail = true
      }, 300)
    } else {
      if (this.isMain) {
        this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
      } else {
        this.resetForm()
        this.isNew = false
        this.isDetail = false
        setTimeout(() => {
          this.isMain = true
        }, 300)
      }
    }
  }

  
  viewDetail(delivery: any) {
    console.log(delivery)
    this.deliveryDetail = delivery
    this.isMain = false
    setTimeout(() => {
      this.isDetail = true
      this.textSecond = ''
    }, 300)
  }

  isNew = false
  isEdit = false
  showNew(is_edit: boolean = false) {
    if (is_edit) {
      this.isEdit = true
      this.deliverySubmit = {...this.deliveryDetail}
    }
    this.isDetail = false
    this.isMain = false
    setTimeout(() => {
      this.isNew = true
    }, 300)
  }

  @ViewChild('clientNeweliveryIcon') fileInput!: ElementRef;
  onImageClick() {
    this.fileInput?.nativeElement.click();
  }

  selectedImageName = ''
  onImageChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedImageName = this.truncateFileName(data.name, 30); // Store the selected file name
      this.functionMain.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.deliverySubmit.icon_image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
    }
  }

  truncateFileName(fileName: string, maxLength: number): string {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedLength = maxLength - extension!.length - 4; // 4 untuk "..." dan "."
    
    return nameWithoutExt.substring(0, truncatedLength) + '...' + '.' + extension;
  }

  handleRefresh(event: any) {
    this.loadDelivery().then(() => event.target.complete())
  }

}
