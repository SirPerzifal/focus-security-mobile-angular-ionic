import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RecordsResidentService } from 'src/app/service/vms/records/records-resident.service';

@Component({
  selector: 'app-client-notification',
  templateUrl: './client-notification.page.html',
  styleUrls: ['./client-notification.page.scss'],
})
export class ClientNotificationPage implements OnInit {

  constructor(public functionMain: FunctionMainService, private clientMainService: ClientMainService, private recordsResidentService: RecordsResidentService, private router: Router) { }

  ngOnInit() {
    this.loadResident()
  }

  Notifications: any = []
  filteredNotifications: any = []
  faPhone = faPhone

  isLoading = false
  loadResident(){
    this.isLoading = true
    this.functionMain.vmsPreferences().then((value: any) => {
      this.clientMainService.getApi({}, '/client/get/notifications').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code == 200) {
            this.Notifications = results.result.notifications
            this.filteredNotifications = this.Notifications
          } else {
            this.functionMain.presentToast(`An error occurred while loading notifications!`, 'danger');
          }
          this.isLoading = false
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while loading notifications!', 'danger');
          console.error(error);
          this.isLoading = false
        }
      });
    })
  }

  onBack() {
    this.router.navigate(['/client-main-app'])
    
  }

}

