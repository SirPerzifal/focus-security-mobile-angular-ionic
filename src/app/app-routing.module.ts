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
  {
    path: 'resident-payment',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/resident-payment.module').then( m => m.ResidentPaymentPageModule)
  },
  {
    path: 'bills-maintenance',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/bills-maintenance/bills-maintenance.module').then( m => m.BillsMaintenancePageModule)
  },
  {
    path: 'bills-fines',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/bills-fines/bills-fines.module').then( m => m.BillsFinesPageModule)
  },
  {
    path: 'bills-history',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/bills-history/bills-history.module').then( m => m.BillsHistoryPageModule)
  },
  {
    path: 'manage-add',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/manage-add/manage-add.module').then( m => m.ManageAddPageModule)
  },
  {
    path: 'manage-new-card',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/manage-new-card/manage-new-card.module').then( m => m.ManageNewCardPageModule)
  },
  {
    path: 'manage-payment-method',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/manage-payment-method/manage-payment-method.module').then( m => m.ManagePaymentMethodPageModule)
  },
  {
    path: 'facility-booking-payment',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-booking-payment/facility-booking-payment.module').then( m => m.FacilityBookingPaymentPageModule)
  },
  {
    path: 'facility-deposits',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-deposits/facility-deposits.module').then( m => m.FacilityDepositsPageModule)
  },
  {
    path: 'facility-history',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-history/facility-history.module').then( m => m.FacilityHistoryPageModule)
  },
  {
    path: 'resident-my-family',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/resident-my-family.module').then( m => m.ResidentMyFamilyPageModule)
  },
  {
    path: 'family-add-member',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/family-add-member/family-add-member.module').then( m => m.FamilyAddMemberPageModule)
  },
  {
    path: 'family-edit-member',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/family-edit-member/family-edit-member.module').then( m => m.FamilyEditMemberPageModule)
  },
  {
    path: 'family-tenant-extend',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/family-tenant-extend/family-tenant-extend.module').then( m => m.FamilyTenantExtendPageModule)
  },
  {
    path: 'collection-module',
    loadChildren: () => import('./modules/collection-module/collection-module.module').then( m => m.CollectionModulePageModule)
  },
  {
    path: 'coaches-module',
    loadChildren: () => import('./modules/coaches-module/coaches-module.module').then( m => m.CoachesModulePageModule)
  },
  {
    path: 'emergency-module',
    loadChildren: () => import('./modules/emergency-module/emergency-module.module').then( m => m.EmergencyModulePageModule)
  },
  {
    path: 'coaches-form',
    loadChildren: () => import('./modules/coaches-module/coaches-form/coaches-form.module').then( m => m.CoachesFormPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
