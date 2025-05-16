import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-facility-detail',
  templateUrl: './client-facility-detail.page.html',
  styleUrls: ['./client-facility-detail.page.scss'],
})
export class ClientFacilityDetailPage implements OnInit {

  constructor(private router: Router, private clientMainService: ClientMainService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { facility: any };
    if (state) {
      this.facilityForm = state.facility

    } 
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack(params: boolean = false) {
    this.router.navigate(['/client-facility'], {queryParams: {facility: true}})
  }

  facilityForm: any = []
  submitForm: any = []

  onRoomChange(event: any) {
    this.selectedRoomId = event.target.value
    this.selectedRoom = this.facilityForm.room_ids.filter((item: any) => item.room_id == event.target.value)[0]
    console.log(this.selectedRoom)
    this.submitForm = this.selectedRoom
    this.roomName = this.submitForm.room_name
  }

  selectedRoom: any
  selectedRoomId = ''
  roomName = ''

  onSubmit() {
    console.log(this.facilityForm)
    let errMsg = ''
    if (!this.selectedRoomId) {
      this.functionMain.presentToast('Select a room first', 'danger')
      return
    } else {
      if (!this.submitForm.room_name) {
        errMsg += "Room name is required! \n"
      }
      if (this.functionMain.timeToInt(this.submitForm.end_time) <= this.functionMain.timeToInt(this.submitForm.start_time)) {
        errMsg += "Close Hour can't be the same as or less than open hour! \n"
      }
      if (errMsg != '') {
        this.functionMain.presentToast(errMsg, 'danger')
        return
      }
      console.log(this.submitForm.start_time, this.submitForm.end_time, this.functionMain.timeToInt(this.submitForm.start_time), this.functionMain.timeToInt(this.submitForm.end_time))
      let params = {
        room_id : this.selectedRoomId,
        name : this.roomName,
        open_time : this.functionMain.timeToInt(this.submitForm.start_time),
        close_time : this.functionMain.timeToInt(this.submitForm.end_time),
        is_close_for_maintenance : this.submitForm.is_close_for_maintenance,
        terms_and_conditions : this.submitForm.terms_and_conditions,
        is_need_checked : this.submitForm.is_need_checked,
      }
      console.log(params)
      this.clientMainService.getApi(params, '/client/post/room').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code == 200) {
            this.functionMain.presentToast(`Successfully update facility!`, 'success');
            this.onBack(true)
          } else {
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while updating facility!', 'danger');
          console.error(error);
        }
      });
    }
  }

  

}
