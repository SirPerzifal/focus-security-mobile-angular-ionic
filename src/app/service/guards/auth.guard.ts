import { CanActivateFn, Router } from '@angular/router';
import { Injectable,inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from '../resident/authenticate/authenticate.service';
import { FunctionMainService } from '../function/function-main.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const functionMain = inject(FunctionMainService) 

  const tokenData = await Preferences.get({ key: 'USER_EMAIL' });
  const mobiletokenData = await Preferences.get({ key: 'USER_MOBILE' });
  const useStateData = await Preferences.get({ key: 'USESTATE_DATA' });


  console.log(tokenData);
  console.log('tokenDatatokenDatatokenDatatokenDatatokenDatatokenData');
  console.log(mobiletokenData);
  console.log('mobiletokenDatamobiletokenDatamobiletokenDatamobiletokenData');
  
  
  if (!tokenData.value) {
    if(!mobiletokenData.value){
      if(state.url=='/'){
        return true;
      }else if(state.url!='/login-end-user'){
        router.navigate(['/login-end-user']);
        return false;
      }else{
        return true;
      }
    }
    
  }

  // const isTokenValid = authService.isTokenValid(useStateData.value);
  
  // if (!tokenData.value) {
  //   await Preferences.remove({ key: 'USER_EMAIL' });
  //   if(state.url=='/'){
  //     return true;
  //   }else if(state.url!='/login-end-user'){
  //     router.navigate(['/login-end-user']);
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }

  if(state.url=='/' || state.url=='/login-end-user'){
    await functionMain.vmsPreferences().then((value) => {
      if (value.is_resident) {
        router.navigate(['/resident-homepage']);
      } else if (value.is_vms) {
        router.navigate(['/home-vms']);
      } else if (value.is_client) {
        router.navigate(['/client-main-app']);
      } else {
        Preferences.get({key: 'USER_EMAIL'}).then(async (value) => {
          console.log(value);
          console.log("valueUSER_EMAILvalueUSER_EMAILvalueUSER_EMAILvalueUSER_EMAIL");
          
          if(value?.value){
            router.navigate(['/resident-homepage']);
          } else {
            Preferences.get({key: 'USER_MOBILE'}).then(async (value) => {
              console.log(value);
              console.log("valueUSER_MOBILEvalueUSER_MOBILEvalueUSER_MOBILEvalueUSER_MOBILE");
              if(value?.value){
                router.navigate(['/resident-homepage']);
              } else {
                router.navigate(['/']);
              }
            })
            router.navigate(['/']);
          }
        })
      }
    })
    return false
  }

  return true;
};