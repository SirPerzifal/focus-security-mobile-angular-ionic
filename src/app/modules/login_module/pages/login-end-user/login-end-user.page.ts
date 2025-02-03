import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

interface LoginUserDto {
  jsonrpc: string,
  params: {
    login: string;
    password: string;
  }
}

@Component({
  selector: 'app-login-end-user',
  templateUrl: './login-end-user.page.html',
  styleUrls: ['./login-end-user.page.scss'],
})
export class LoginEndUserPage implements OnInit {

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

  onPasswordChange(value: string): void {
    this.existUser.params.password = value;
  }

  async loginResident(){
    if(!this.existUser.params.login && !this.existUser.params.password){
      return
    }else{
      try{
        this.authService.postLoginAuthenticate(this.existUser.params.login,this.existUser.params.password).subscribe(
          res => {
            console.log(res);
            if (res.result.status_code == 200) {
              this.presentToast('Success Add Record', 'success');
              Preferences.set({
                key: 'USER_INFO',
                value: JSON.stringify(res.result.access_token),
              }).then(()=>{
                this.router.navigate(['/resident-homepage']);
              });
              // {
              //   'user_id' : user_id,
              //   'family_id': family_id,
              //   'partner_id': partner_id,
              //   'name': name,
              //   'email': email,
              //   'exp': datetime.now() + timedelta(days=365)
              //   }
            } else {
              this.presentToast('Login Failed', 'danger');
            }
          },
          error => {
            console.error('Error:', error);
          }
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
      }
    }

  }

  async loginCommercial(){
    this.router.navigate(['/resident-homepage']);
  }



  ngOnInit() {
  }

}
