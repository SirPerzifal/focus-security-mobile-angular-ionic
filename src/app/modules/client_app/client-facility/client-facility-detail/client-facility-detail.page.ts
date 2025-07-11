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
  isNew = false

  onRoomChange(event: any) {
    this.selectedRoomId = event.target.value
    console.log(this.selectedRoomId)
    if (this.selectedRoomId == 'create_new') {
      this.createNew()
    } else {
      this.isNew = false
      this.selectedRoom = this.facilityForm.room_ids.filter((item: any) => item.room_id == event.target.value)[0]
      console.log(this.selectedRoom)
      this.submitForm = this.selectedRoom
      this.roomName = this.submitForm.room_name
    }
  }

  selectedRoom: any
  selectedRoomId = ''
  roomName = ''

  onSubmit() {
    console.log(this.submitForm)
    console.log(this.functionMain.timeToInt(this.submitForm.end_time), this.functionMain.timeToInt(this.submitForm.start_time))
    let errMsg = ''
    if (!this.selectedRoomId) {
      this.functionMain.presentToast('Select a room first', 'danger')
      return
    } else {
      if (!this.roomName) {
        errMsg += "Room name is required! \n"
      }
      if ((!this.functionMain.timeToInt(this.submitForm.end_time) && this.submitForm.end_time == false) || (!this.functionMain.timeToInt(this.submitForm.start_time) && this.submitForm.start_time == false)) {
        errMsg += "Open hour and close hour are required! \n"
      } else {
        if (this.functionMain.timeToInt(this.submitForm.end_time) <= this.functionMain.timeToInt(this.submitForm.start_time)) {
          errMsg += "Close hour can't be the same as or less than open hour! \n"
        }
      }
      if (!this.submitForm.hours_interval) {
        errMsg += "Hours interval is required! \n"
      } else {
        if (this.submitForm.hours_interval == 0 || this.submitForm.hours_interval > 24) {
          errMsg += "The hour interval must be greater than 0 and less than or equal to 24! \n"
        }
      }
      if (errMsg != '') {
        this.functionMain.presentToast(errMsg, 'danger')
        return
      }
      let params = {
        is_new: this.isNew,
        facility_id: this.facilityForm.facility_id,
        room_id : this.isNew ? false : this.selectedRoomId,
        name : this.roomName,
        open_time : this.functionMain.timeToInt(this.submitForm.start_time),
        close_time : this.functionMain.timeToInt(this.submitForm.end_time),
        is_close_for_maintenance : this.submitForm.is_close_for_maintenance,
        terms_and_conditions : this.submitForm.terms_and_conditions,
        is_need_checked : this.submitForm.is_need_checked,
        is_require_approval : this.submitForm.is_require_approval,
        hours_interval : this.submitForm.hours_interval,
      }
      console.log(params)
      this.clientMainService.getApi(params, '/client/post/room').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code == 200) {
            this.functionMain.presentToast(`Successfully update room!`, 'success');
            this.onBack(true)
          } else {
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while updating room!', 'danger');
          console.error(error);
        }
      });
    }
  }

  createNew() {
    console.log("CREAATE NEEWWWWW")
    this.selectedRoomId = 'create_new'
    this.isNew = true
    this.roomName = ''

    this.selectedRoom = {
      start_time: false,
      end_time: false,
      is_close_for_maintenance: false,
      is_need_checked: false,
      terms_and_conditions: '',
      is_require_approval : false,
      hours_interval : 1,
    }
    this.submitForm = this.selectedRoom
  }

}
