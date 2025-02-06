import { CanActivateFn, Router } from '@angular/router';
import { Injectable,inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from '../resident/authenticate/authenticate.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const tokenData = await Preferences.get({ key: 'USER_INFO' });

  if (!tokenData.value) {
    router.navigate(['/login-end-user']);
    return false;
  }

  const isTokenValid = authService.isTokenValid(tokenData.value);
  
  if (!isTokenValid) {
    await Preferences.remove({ key: 'USER_INFO' });
    router.navigate(['/login-end-user']);
    return false;
  }

  return true;
};
