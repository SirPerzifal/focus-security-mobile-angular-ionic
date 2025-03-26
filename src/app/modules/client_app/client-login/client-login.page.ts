import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/client-app/authenticate/authenticate.service';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';


interface LoginUserDto {
  jsonrpc: string,
  params: {
    login: string;
    password: string;
  }
}

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.page.html',
  styleUrls: ['./client-login.page.scss'],
})

export class ClientLoginPage implements OnInit {

  existUser: LoginUserDto = {
    jsonrpc: '2.0',
    params: {
      login: '',
      password: '',
    },
  };

  constructor(
    private router: Router,
    // private userService: UserService,
    private authService: AuthService,
    // private toastController: ToastrController
    private toastController: ToastController
  ) { }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present().then(() => {
    });;
  }

  onLoginChange(value: string): void {
    this.existUser.params.login = value
  }

  onPasswordChange(password: string): void {
    this.existUser.params.password = password;
  }

  async login(){
    console.log(this.existUser);

    if(!this.existUser.params.login || !this.existUser.params.password){
      return
    }else{
      try{
        this.authService.postLoginAuthenticate(this.existUser.params.login,this.existUser.params.password).subscribe(
          res => {
            console.log(res);
            console.log(res.result.status_code);
            if (res.result.status_code == 200) {
              Preferences.set({
                key: 'USER_INFO',
                value: JSON.stringify(res.result.access_token),
              }).then(()=>{
                this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
              });
            } else {
              this.presentToast(`Login ${res.result.status_desc}`, 'danger');
            }
          },
          error => {
            console.error('Error:', error);
            this.presentToast('Login Failed :'+String(error.message), 'danger');
          }
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
      }
    }
  }

  async loginCommercial(){
    this.router.navigate(['/client-main-app'])
  }


  ngOnInit() {
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
