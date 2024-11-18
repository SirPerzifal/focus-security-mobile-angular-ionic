import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login_module/pages/login-process/login-process.module').then( m => m.LoginProcessPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login_module/pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home-vms',
    loadChildren: () => import('./modules/home_module/pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login-process',
    loadChildren: () => import('./modules/login_module/pages/login-process/login-process.module').then( m => m.LoginProcessPageModule)
  },
  {
    path: 'vms-barcode',
    loadChildren: () => import('./modules/login_module/pages/vms-barcode/vms-barcode.module').then( m => m.VmsBarcodePageModule)
  },
  {
    path: 'walk-in',
    loadChildren: () => import('./modules/visitor_module/visitor/walk-in/walk-in.module').then( m => m.WalkInPageModule)
  },
  {
    path: 'move-home',
    loadChildren: () => import('./modules/move_module/pages/move-home/move-home.module').then( m => m.MoveHomePageModule)
  },
  {
    path: 'move-form',
    loadChildren: () => import('./modules/move_module/pages/move-form/move-form.module').then( m => m.MoveFormPageModule)
  },
  {
    path: 'renov-form',
    loadChildren: () => import('./modules/move_module/pages/renov-form/renov-form.module').then( m => m.RenovFormPageModule)
  },
  {
    path: 'contractor-form',
    loadChildren: () => import('./modules/contractor_module/pages/contractor-form/contractor-form.module').then( m => m.ContractorFormPageModule)
  },
  {
    path: 'pick-up-page',
    loadChildren: () => import('./modules/pick_up_modules/pages/pick-up-page/pick-up-page.module').then( m => m.PickUpPagePageModule)
  },
  {
    path: 'deliveries',
    loadChildren: () => import('./modules/deliveries_module/pages/deliveries/deliveries.module').then( m => m.DeliveriesPageModule)
  },
  {
    path: 'hired-car',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/hired-car/hired-car.module').then( m => m.HiredCarPageModule)
  },
  {
    path: 'login-end-user',
    loadChildren: () => import('./modules/login_module/pages/login-end-user/login-end-user.module').then( m => m.LoginEndUserPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./modules/register_module/pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'register-resident',
    loadChildren: () => import('./modules/register_module/pages/register-resident/register-resident.module').then( m => m.RegisterResidentPageModule)
  },
  {
    path: 'register-commercial',
    loadChildren: () => import('./modules/register_module/pages/register-commercial/register-commercial.module').then( m => m.RegisterCommercialPageModule)
  },
  {
    path: 'resident-homepage',
    loadChildren: () => import('./modules/resident_module/pages/resident-homepage/resident-homepage.module').then( m => m.ResidentHomepagePageModule)
  },
  {
    path: 'resident-visitors',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/resident-visitors.module').then( m => m.ResidentVisitorsPageModule)
  },
  {
    path: 'invite-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/invite-form/invite-form.module').then( m => m.InviteFormPageModule)
  },
  {
    path: 'invite-from-history',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/invite-from-history/invite-from-history.module').then( m => m.InviteFromHistoryPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'history-details',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/history-details/history-details.module').then( m => m.HistoryDetailsPageModule)
  },
  {
    path: 'resident-facility-bookings',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/resident-facility-bookings.module').then( m => m.ResidentFacilityBookingsPageModule)
  },
  {
    path: 'facility-new-booking',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-new-booking/facility-new-booking.module').then( m => m.FacilityNewBookingPageModule)
  },
  {
    path: 'facility-place-booking',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-place-booking/facility-place-booking.module').then( m => m.FacilityPlaceBookingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
