import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-rfid-user-list',
  templateUrl: './client-rfid-user-list.page.html',
  styleUrls: ['./client-rfid-user-list.page.scss'],
})
export class ClientRfidUserListPage implements OnInit {

  isLoading = false
  userList: any[] = []
  cardCodeSelect: string = ''

  constructor(
    private router: Router,
    private clientMainApi: ClientMainService,
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    this.loadUserListFromDevice();
  }

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.loadUserListFromDevice();
      event.target.complete();
    }, 1000)
  }

  onBack() {
    this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
  }

  loadUserListFromDevice() {
    this.cardCodeSelect = '';
    this.userList = []
    this.userList.pop()
    this.clientMainApi.getApi({}, '/client/get/rfid_user_list').subscribe((response: any) => {
      const result = response.result.result ? response.result.result : null
      if (response) {
        this.userList = result.map((listUser: any) => {
          // Filter access cards: if all card_codes are '0', access_mode should be empty []
          const validAccessCards = listUser.access.filter((card: any) => card.card_code !== '0');
          return {
            user_id: listUser.id,
            user_name: listUser.name,
            access_mode: validAccessCards.length > 0 ? validAccessCards.map((card: any) => ({
              access_mode: card.access_mode,
              card_code: card.card_code
            })) : []
          }
        })
        console.log(this.userList);
        
        this.isLoading = false;
      } else {
        this.functionMain.presentToast('No user found from device', 'warning')
      }
    })
  }

  handleChangeValue(event: CustomEvent) {
    console.log(event.detail.value);
    this.cardCodeSelect = event.detail.value
  }

  onClickButton(user: any, type: string) {
    if (type === 'give_access') {
      this.clientMainApi.getApi({user_id: user.user_id}, '/client/post/upload_rfid_user').subscribe((response: any) => {
        console.log(response);
        this.loadUserListFromDevice();
      })
    } else if (type === 'revoke_access') {
      this.clientMainApi.getApi({user_id: user.user_id}, '/client/post/delete_rfid_user').subscribe((response: any) => {
        console.log(response);
        this.loadUserListFromDevice();
      })
    }
  }
}
