import { CanActivateFn, Router } from '@angular/router';
import { Injectable,inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from '../resident/authenticate/authenticate.service';
import { FunctionMainService } from '../function/function-main.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const functionMain = inject(FunctionMainService) 

  const tokenData = await Preferences.get({ key: 'USER_INFO' });
  const useStateData = await Preferences.get({ key: 'USESTATE_DATA' });
  const userInfoData = await Preferences.get({ key: 'USER_INFO'})

  let currentUrl = (state.url).split('?')[0]
  
  if (!tokenData.value && !userInfoData.value) {
    if (currentUrl == '/'){
      return true;
    } else if(currentUrl == '/home-vms'){
      router.navigate(['/login-vms']);
      return false;
    } else if(currentUrl != '/login-end-user'){
      router.navigate(['/login-end-user']);
      return false;
    } else{
      return true;
    }
  } 

  // const isTokenValid = authService.isTokenValid(useStateData.value);
  
  // if (!tokenData.value) {
  //   await Preferences.remove({ key: 'USER_EMAIL' });
  //   if(currentUrl=='/'){
  //     return true;
  //   }else if(currentUrl!='/login-end-user'){
  //     router.navigate(['/login-end-user']);
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }

  console.log('555555555555555555authGuardauthGuardauthGuard555555555555555555authGuardauthGuardauthGuard');
  

  if(currentUrl=='/' || currentUrl=='/login-end-user'){
    await functionMain.vmsPreferences().then((value) => {
      if (value.is_resident) {
        router.navigate(['/resident-home-page']);
      } else if (value.is_vms) {
        router.navigate(['/home-vms']);
      } else if (value.is_client) {
        router.navigate(['/client-main-app'], {queryParams: {reload: true}});
      } else {
        Preferences.get({key: 'USER_INFO'}).then(async (value) => {
          if(value?.value){
            router.navigate(['/resident-home-page']);
          } 
        })
      }
    })
    return false
  }

  return true;
};