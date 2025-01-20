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
    path: 'unregistered-resident-car',
    loadChildren: () => import('./modules/unregistered_resident_car/pages/unregistered-resident-car/unregistered-resident-car.module').then( m => m.UnregisteredResidentCarPageModule)
  },
  {
    path: 'ma-visitor-list',
    loadChildren: () => import('./modules/ma_visitor_list/pages/ma-visitor-list/ma-visitor-list.module').then( m => m.MaVisitorListPageModule)
  },
  {
    path: 'ma-visitor-form',
    loadChildren: () => import('./modules/ma_visitor_list/pages/ma-visitor-form/ma-visitor-form.module').then( m => m.MaVisitorFormPageModule)
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
  {
    path: 'resident-my-vehicle',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/resident-my-vehicle.module').then( m => m.ResidentMyVehiclePageModule)
  },
  {
    path: 'my-vehicle-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/my-vehicle-form/my-vehicle-form.module').then( m => m.MyVehicleFormPageModule)
  },
  {
    path: 'my-vehicle-detail',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/my-vehicle-detail/my-vehicle-detail.module').then( m => m.MyVehicleDetailPageModule)
  },
  {
    path: 'vehicle-records-page',
    loadChildren: () => import('./modules/vehicle_records_module/pages/vehicle-records-page/vehicle-records-page.module').then( m => m.VehicleRecordsPagePageModule)
  },
  {
    path: 'visitor-records',
    loadChildren: () => import('./modules/visitor_records_module/pages/visitor-records/visitor-records.module').then( m => m.VisitorRecordsPageModule)
  },
  {
    path: 'visitor-record-detail',
    loadChildren: () => import('./modules/visitor_records_module/pages/visitor-record-detail/visitor-record-detail.module').then( m => m.VisitorRecordDetailPageModule)
  },
  {
    path: 'alert-main',
    loadChildren: () => import('./modules/alert_module/pages/alert-main/alert-main.module').then( m => m.AlertMainPageModule)
  },
  {
    path: 'resident-car-list',
    loadChildren: () => import('./modules/resident_car_list_module/pages/resident-car-list/resident-car-list.module').then( m => m.ResidentCarListPageModule)
  },
  {
    path: 'resident-car-warning-clamp',
    loadChildren: () => import('./modules/resident_car_list_module/pages/resident-car-warning-clamp/resident-car-warning-clamp.module').then( m => m.ResidentCarWarningClampPageModule)
  },
  {
    path: 'overnight-parking-list',
    loadChildren: () => import('./modules/overnight_parking_list_module/pages/overnight-parking-list/overnight-parking-list.module').then( m => m.OvernightParkingListPageModule)
  },
  {
    path: 'overnight-parking-form',
    loadChildren: () => import('./modules/overnight_parking_list_module/pages/overnight-parking-form/overnight-parking-form.module').then( m => m.OvernightParkingFormPageModule)
  },
  {
    path: 'renovation-home',
    loadChildren: () => import('./modules/move_module/pages/renovation-home/renovation-home.module').then( m => m.RenovationHomePageModule)
  },
  {
    path: 'alert-paynow',
    loadChildren: () => import('./modules/alert_module/pages/alert-paynow/alert-paynow.module').then( m => m.AlertPaynowPageModule)
  },
  {
    path: 'overnight-parking-detail',
    loadChildren: () => import('./modules/overnight_parking_list_module/pages/overnight-parking-detail/overnight-parking-detail.module').then( m => m.OvernightParkingDetailPageModule)
  },
  {
    path: 'records-main',
    loadChildren: () => import('./modules/records_module/pages/records-main/records-main.module').then( m => m.RecordsMainPageModule)
  },
  {
    path: 'records-wheel-clamped',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-wheel-clamped.module').then( m => m.RecordsWheelClampedPageModule)
  },
  {
    path: 'records-wheel-clamped-detail',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-wheel-clamped-detail/records-wheel-clamped-detail.module').then( m => m.RecordsWheelClampedDetailPageModule)
  },
  {
    path: 'records-wheel-clamped-payment',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-wheel-clamped-payment/records-wheel-clamped-payment.module').then( m => m.RecordsWheelClampedPaymentPageModule)
  },
  {
    path: 'records-wheel-clamped-new',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-wheel-clamped-new/records-wheel-clamped-new.module').then( m => m.RecordsWheelClampedNewPageModule)
  },
  {
    path: 'move-detail',
    loadChildren: () => import('./modules/move_module/pages/move-detail/move-detail.module').then( m => m.MoveDetailPageModule)
  },
  {
    path: 'records-warning-history',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-warning-history/records-warning-history.module').then( m => m.RecordsWarningHistoryPageModule)
  },
  {
    path: 'records-warning-detail',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-warning-detail/records-warning-detail.module').then( m => m.RecordsWarningDetailPageModule)
  },
  {
    path: 'overnight-parking-modal',
    loadChildren: () => import('./modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.module').then( m => m.OvernightParkingModalPageModule)
  },
  {
    path: 'records-blacklist',
    loadChildren: () => import('./modules/records_module/pages/records-blacklist/records-blacklist.module').then( m => m.RecordsBlacklistPageModule)
  },
  {
    path: 'records-blacklist-form',
    loadChildren: () => import('./modules/records_module/pages/records-blacklist/records-blacklist-form/records-blacklist-form.module').then( m => m.RecordsBlacklistFormPageModule)
  },
  {
    path: 'records-blacklist-detail',
    loadChildren: () => import('./modules/records_module/pages/records-blacklist/records-blacklist-detail/records-blacklist-detail.module').then( m => m.RecordsBlacklistDetailPageModule)
  },
  {
    path: 'records-visitor',
    loadChildren: () => import('./modules/records_module/pages/records-visitor/records-visitor.module').then( m => m.RecordsVisitorPageModule)
  },
  {
    path: 'records-visitor-detail',
    loadChildren: () => import('./modules/records_module/pages/records-visitor/records-visitor-detail/records-visitor-detail.module').then( m => m.RecordsVisitorDetailPageModule)
  },
  {
    path: 'records-facility',
    loadChildren: () => import('./modules/records_module/pages/records-facility/records-facility.module').then( m => m.RecordsFacilityPageModule)
  },
  {
    path: 'records-facility-detail',
    loadChildren: () => import('./modules/records_module/pages/records-facility/records-facility-detail/records-facility-detail.module').then( m => m.RecordsFacilityDetailPageModule)
  },
  {
    path: 'records-facility-check-out',
    loadChildren: () => import('./modules/records_module/pages/records-facility/records-facility-check-out/records-facility-check-out.module').then( m => m.RecordsFacilityCheckOutPageModule)
  },
  {
    path: 'resident-notification',
    loadChildren: () => import('./modules/resident_module/pages/resident-notification/resident-notification.module').then( m => m.ResidentNotificationPageModule)
  },
  {
    path: 'resident-quick-dials',
    loadChildren: () => import('./modules/resident_module/pages/resident-quick-dials/resident-quick-dials.module').then( m => m.ResidentQuickDialsPageModule)
  },
  {
    path: 'resident-polling',
    loadChildren: () => import('./modules/resident_module/pages/resident-polling/resident-polling.module').then( m => m.ResidentPollingPageModule)
  },
  {
    path: 'upcoming-polling',
    loadChildren: () => import('./modules/resident_module/pages/resident-polling/upcoming-polling/upcoming-polling.module').then( m => m.UpcomingPollingPageModule)
  },
  {
    path: 'closed-polling',
    loadChildren: () => import('./modules/resident_module/pages/resident-polling/closed-polling/closed-polling.module').then( m => m.ClosedPollingPageModule)
  },
  {
    path: 'resident-house-rules',
    loadChildren: () => import('./modules/resident_module/pages/resident-house-rules/resident-house-rules.module').then( m => m.ResidentHouseRulesPageModule)
  },
  {
    path: 'resident-report-an-issue',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-issue/resident-report-an-issue.module').then( m => m.ResidentReportAnIssuePageModule)
  },
  {
    path: 'record',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-issue/record/record.module').then( m => m.RecordPageModule)
  },
  {
    path: 'resident-report-an-app-issue',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-app-issue/resident-report-an-app-issue.module').then( m => m.ResidentReportAnAppIssuePageModule)
  },
  {
    path: 'record-app-report',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-app-issue/record-app-report/record-app-report.module').then( m => m.RecordAppReportPageModule)
  },
  {
    path: 'resident-upcoming-event',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/resident-upcoming-event.module').then( m => m.ResidentUpcomingEventPageModule)
  },
  {
    path: 'history-upcoming-event',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/history-upcoming-event/history-upcoming-event.module').then( m => m.HistoryUpcomingEventPageModule)
  },
  {
    path: 'resident-door-access',
    loadChildren: () => import('./modules/resident_module/pages/resident-door-access/resident-door-access.module').then( m => m.ResidentDoorAccessPageModule)
  },
  {
    path: 'resident-deals-page',
    loadChildren: () => import('./modules/resident_module/pages/resident-deals-page/resident-deals-page.module').then( m => m.ResidentDealsPagePageModule)
  },
  {
    path: 'resident-announcement-page',
    loadChildren: () => import('./modules/resident_module/pages/resident-announcement-page/resident-announcement-page.module').then( m => m.ResidentAnnouncementPagePageModule)
  },
  {
    path: 'favourite-announcement',
    loadChildren: () => import('./modules/resident_module/pages/resident-announcement-page/favourite-announcement/favourite-announcement.module').then( m => m.FavouriteAnnouncementPageModule)
  },
  {
    path: 'resident-find-a-service-provider',
    loadChildren: () => import('./modules/resident_module/pages/resident-find-a-service-provider/resident-find-a-service-provider.module').then( m => m.ResidentFindAServiceProviderPageModule)
  },
  {
    path: 'resident-raise-a-request',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/resident-raise-a-request.module').then( m => m.ResidentRaiseARequestPageModule)
  },
  {
    path: 'rejected-request',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/rejected-request/rejected-request.module').then( m => m.RejectedRequestPageModule)
  },
  {
    path: 'resident-settings-page',
    loadChildren: () => import('./modules/resident_module/pages/resident-settings-page/resident-settings-page.module').then( m => m.ResidentSettingsPagePageModule)
  },
  {
    path: 'setting-notification',
    loadChildren: () => import('./modules/resident_module/pages/resident-settings-page/setting-notification/setting-notification.module').then( m => m.SettingNotificationPageModule)
  },
  {
    path: 'resident-my-profile',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/resident-my-profile.module').then( m => m.ResidentMyProfilePageModule)
  },
  {
    path: 'my-profile-family-member',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-family-member/my-profile-family-member.module').then( m => m.MyProfileFamilyMemberPageModule)
  },
  {
    path: 'my-profile-house-employee',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-house-employee/my-profile-house-employee.module').then( m => m.MyProfileHouseEmployeePageModule)
  },
  {
    path: 'my-profile-my-pets',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-my-pets/my-profile-my-pets.module').then( m => m.MyProfileMyPetsPageModule)
  },
  {
    path: 'my-profile-estate',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-estate/my-profile-estate.module').then( m => m.MyProfileEstatePageModule)
  },
  {
    path: 'my-profile-add-estate',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-add-estate/my-profile-add-estate.module').then( m => m.MyProfileAddEstatePageModule)
  },
  {
    path: 'overnight-form-rar',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/overnight-form-rar/overnight-form-rar.module').then( m => m.OvernightFormRarPageModule)
  },
  {
    path: 'records-residents',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents.module').then( m => m.RecordsResidentsPageModule)
  },
  {
    path: 'records-residents-detail',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents-detail/records-residents-detail.module').then( m => m.RecordsResidentsDetailPageModule)
  },
  {
    path: 'move-in-out-permit',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/move-in-out-permit/move-in-out-permit.module').then( m => m.MoveInOutPermitPageModule)
  },
  // {
  //   path: 'client-main-app',
  //   loadChildren: () => import('./modules/resident_module/pages/client_app/client-main-app/client-main-app.module').then( m => m.ClientMainAppPageModule)
  // },
  {
    path: 'upcoming-event-calendar-view',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/upcoming-event-calendar-view/upcoming-event-calendar-view.module').then( m => m.UpcomingEventCalendarViewPageModule)
  },
  {
    path: 'renovation-permit',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/renovation-permit/renovation-permit.module').then( m => m.RenovationPermitPageModule)
  },
  {
    path: 'records-residents-modal',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents-modal/records-residents-modal.module').then( m => m.RecordsResidentsModalPageModule)
  },
  {
    path: 'appeal-parking-fines',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/appeal-parking-fines/appeal-parking-fines.module').then( m => m.AppealParkingFinesPageModule)
  },
  {
    path: 'appeal-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/appeal-parking-fines/appeal-form/appeal-form.module').then( m => m.AppealFormPageModule)
  },
  {
    path: 'alert-modal',
    loadChildren: () => import('./modules/alert_module/pages/alert-modal/alert-modal.module').then( m => m.AlertModalPageModule)
  },
  {
    path: 'payment-deposits',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/payment-deposits/payment-deposits.module').then( m => m.PaymentDepositsPageModule)
  },
  {
    path: 'facility-history-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-history-form/facility-history-form.module').then( m => m.FacilityHistoryFormPageModule)
  },
  {
    path: 'access-card-application',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/access-card-application/access-card-application.module').then( m => m.AccessCardApplicationPageModule)
  },
  {
    path: 'bicycle-tag-application',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/bicycle-tag-application/bicycle-tag-application.module').then( m => m.BicycleTagApplicationPageModule)
  },
  {
    path: 'coach-registration',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/coach-registration/coach-registration.module').then( m => m.CoachRegistrationPageModule)
  },
  {
    path: 'pet-registration',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/pet-registration/pet-registration.module').then( m => m.PetRegistrationPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
