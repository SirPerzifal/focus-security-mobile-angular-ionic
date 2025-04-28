import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RecordsResidentService } from 'src/app/service/vms/records/records-resident.service';

@Component({
  selector: 'app-client-residents',
  templateUrl: './client-residents.page.html',
  styleUrls: ['./client-residents.page.scss'],
})
export class ClientResidentsPage implements OnInit {

  constructor(private webRtcService: WebRtcService, public functionMain: FunctionMainService, private clientMain: ClientMainService, private recordsResidentService: RecordsResidentService, private router: Router) { }

  ngOnInit() {
    this.loadResident()
  }

  Residents: any = []
  faPhone = faPhone

  isLoading = false
  loadResident(){
    this.isLoading = true
    this.functionMain.vmsPreferences().then((value: any) => {
      this.recordsResidentService.loadAllResident(value.project_id, false).subscribe(
        (response: any) => {
          console.log(response)
          if (response.result.status === 'success') {
            console.log(response)
            this.Residents = response.result.data;
          } else {
            // this.presentToast('Failed to load resident data', 'danger');
          }
          this.isLoading = false
        },
      )
    })
  }

  onBack() {
    this.router.navigate(['/client-main-app'])
    
  }

  callResident(resident: any) {
    this.webRtcService.createOffer(false, resident.family_id, false, false);
  }

}
