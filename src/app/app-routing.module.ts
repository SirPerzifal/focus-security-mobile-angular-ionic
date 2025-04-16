import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './service/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login_module/pages/login-process/login-process.module').then( m => m.LoginProcessPageModule),
    canActivate:[authGuard]
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
    loadChildren: () => import('./modules/login_module/pages/login-process/login-process.module').then( m => m.LoginProcessPageModule),
    canActivate:[authGuard]
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
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/hired-car/hired-car.module').then( m => m.HiredCarPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'login-end-user',
    loadChildren: () => import('./modules/login_module/pages/login-end-user/login-end-user.module').then( m => m.LoginEndUserPageModule),
    canActivate:[authGuard]
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
    loadChildren: () => import('./modules/resident_module/pages/resident-homepage/resident-homepage.module').then( m => m.ResidentHomepagePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-visitors',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/resident-visitors.module').then( m => m.ResidentVisitorsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'invite-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/invite-form/invite-form.module').then( m => m.InviteFormPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'invite-from-history',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/invite-from-history/invite-from-history.module').then( m => m.InviteFromHistoryPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/history/history.module').then( m => m.HistoryPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'history-details',
    loadChildren: () => import('./modules/resident_module/pages/resident-visitors/history-details/history-details.module').then( m => m.HistoryDetailsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-facility-bookings',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/resident-facility-bookings.module').then( m => m.ResidentFacilityBookingsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'facility-new-booking',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-new-booking/facility-new-booking.module').then( m => m.FacilityNewBookingPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'facility-place-booking',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-place-booking/facility-place-booking.module').then( m => m.FacilityPlaceBookingPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-payment',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/resident-payment.module').then( m => m.ResidentPaymentPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'bills-maintenance',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/bills-maintenance/bills-maintenance.module').then( m => m.BillsMaintenancePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'bills-fines',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/bills-fines/bills-fines.module').then( m => m.BillsFinesPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'bills-history',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/bills-history/bills-history.module').then( m => m.BillsHistoryPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'manage-add',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/manage-add/manage-add.module').then( m => m.ManageAddPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'manage-new-card',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/manage-new-card/manage-new-card.module').then( m => m.ManageNewCardPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'manage-payment-method',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/manage-payment-method/manage-payment-method.module').then( m => m.ManagePaymentMethodPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'facility-booking-payment',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-booking-payment/facility-booking-payment.module').then( m => m.FacilityBookingPaymentPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'facility-deposits',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-deposits/facility-deposits.module').then( m => m.FacilityDepositsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'facility-history',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-history/facility-history.module').then( m => m.FacilityHistoryPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-my-family',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/resident-my-family.module').then( m => m.ResidentMyFamilyPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'family-add-member',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/family-add-member/family-add-member.module').then( m => m.FamilyAddMemberPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'family-edit-member',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/family-edit-member/family-edit-member.module').then( m => m.FamilyEditMemberPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'family-tenant-extend',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-family/family-tenant-extend/family-tenant-extend.module').then( m => m.FamilyTenantExtendPageModule),
    canActivate:[authGuard]
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
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/resident-my-vehicle.module').then( m => m.ResidentMyVehiclePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-vehicle-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/my-vehicle-form/my-vehicle-form.module').then( m => m.MyVehicleFormPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-vehicle-detail',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/my-vehicle-detail/my-vehicle-detail.module').then( m => m.MyVehicleDetailPageModule),
    canActivate:[authGuard]
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
    path: 'estate-modal',
    loadChildren: () => import('./modules/resident_module/pages/resident-homepage/estate-modal/estate-modal.module').then( m => m.EstateModalPageModule)
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
    loadChildren: () => import('./modules/resident_module/pages/resident-notification/resident-notification.module').then( m => m.ResidentNotificationPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-quick-dials',
    loadChildren: () => import('./modules/resident_module/pages/resident-quick-dials/resident-quick-dials.module').then( m => m.ResidentQuickDialsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-polling',
    loadChildren: () => import('./modules/resident_module/pages/resident-polling/resident-polling.module').then( m => m.ResidentPollingPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'upcoming-polling',
    loadChildren: () => import('./modules/resident_module/pages/resident-polling/upcoming-polling/upcoming-polling.module').then( m => m.UpcomingPollingPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'closed-polling',
    loadChildren: () => import('./modules/resident_module/pages/resident-polling/closed-polling/closed-polling.module').then( m => m.ClosedPollingPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-house-rules',
    loadChildren: () => import('./modules/resident_module/pages/resident-house-rules/resident-house-rules.module').then( m => m.ResidentHouseRulesPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-report-an-issue',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-issue/resident-report-an-issue.module').then( m => m.ResidentReportAnIssuePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'record',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-issue/record/record.module').then( m => m.RecordPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-report-an-app-issue',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-app-issue/resident-report-an-app-issue.module').then( m => m.ResidentReportAnAppIssuePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'record-app-report',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-app-issue/record-app-report/record-app-report.module').then( m => m.RecordAppReportPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-upcoming-event',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/resident-upcoming-event.module').then( m => m.ResidentUpcomingEventPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'history-upcoming-event',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/history-upcoming-event/history-upcoming-event.module').then( m => m.HistoryUpcomingEventPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-door-access',
    loadChildren: () => import('./modules/resident_module/pages/resident-door-access/resident-door-access.module').then( m => m.ResidentDoorAccessPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-deals-page',
    loadChildren: () => import('./modules/resident_module/pages/resident-deals-page/resident-deals-page.module').then( m => m.ResidentDealsPagePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-announcement-page',
    loadChildren: () => import('./modules/resident_module/pages/resident-announcement-page/resident-announcement-page.module').then( m => m.ResidentAnnouncementPagePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'favourite-announcement',
    loadChildren: () => import('./modules/resident_module/pages/resident-announcement-page/favourite-announcement/favourite-announcement.module').then( m => m.FavouriteAnnouncementPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-find-a-service-provider',
    loadChildren: () => import('./modules/resident_module/pages/resident-find-a-service-provider/resident-find-a-service-provider.module').then( m => m.ResidentFindAServiceProviderPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-raise-a-request',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/resident-raise-a-request.module').then( m => m.ResidentRaiseARequestPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'rejected-request',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/rejected-request/rejected-request.module').then( m => m.RejectedRequestPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-settings-page',
    loadChildren: () => import('./modules/resident_module/pages/resident-settings-page/resident-settings-page.module').then( m => m.ResidentSettingsPagePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'setting-notification',
    loadChildren: () => import('./modules/resident_module/pages/resident-settings-page/setting-notification/setting-notification.module').then( m => m.SettingNotificationPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'resident-my-profile',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/resident-my-profile.module').then( m => m.ResidentMyProfilePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-profile-family-member',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-family-member/my-profile-family-member.module').then( m => m.MyProfileFamilyMemberPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-profile-house-employee',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-house-employee/my-profile-house-employee.module').then( m => m.MyProfileHouseEmployeePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-profile-my-pets',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-my-pets/my-profile-my-pets.module').then( m => m.MyProfileMyPetsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-profile-estate',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-estate/my-profile-estate.module').then( m => m.MyProfileEstatePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'my-profile-add-estate',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-add-estate/my-profile-add-estate.module').then( m => m.MyProfileAddEstatePageModule),
    canActivate:[authGuard]
  },
  {
    path: 'overnight-form-rar',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/overnight-form-rar/overnight-form-rar.module').then( m => m.OvernightFormRarPageModule),
    canActivate:[authGuard]
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
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/move-in-out-permit/move-in-out-permit.module').then( m => m.MoveInOutPermitPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'client-main-app',
    loadChildren: () => import('./modules/client_app/client-main-app/client-main-app.module').then( m => m.ClientMainAppPageModule)
  },
  {
    path: 'upcoming-event-calendar-view',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/upcoming-event-calendar-view/upcoming-event-calendar-view.module').then( m => m.UpcomingEventCalendarViewPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'renovation-permit',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/renovation-permit/renovation-permit.module').then( m => m.RenovationPermitPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'records-residents-modal',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents-modal/records-residents-modal.module').then( m => m.RecordsResidentsModalPageModule)
  },
  {
    path: 'appeal-parking-fines',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/appeal-parking-fines/appeal-parking-fines.module').then( m => m.AppealParkingFinesPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'appeal-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/appeal-parking-fines/appeal-form/appeal-form.module').then( m => m.AppealFormPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'alert-modal',
    loadChildren: () => import('./modules/alert_module/pages/alert-modal/alert-modal.module').then( m => m.AlertModalPageModule)
  },
  {
    path: 'payment-deposits',
    loadChildren: () => import('./modules/resident_module/pages/resident-payment/payment-deposits/payment-deposits.module').then( m => m.PaymentDepositsPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'facility-history-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-facility-bookings/facility-history-form/facility-history-form.module').then( m => m.FacilityHistoryFormPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'access-card-application',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/access-card-application/access-card-application.module').then( m => m.AccessCardApplicationPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'bicycle-tag-application',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/bicycle-tag-application/bicycle-tag-application.module').then( m => m.BicycleTagApplicationPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'coach-registration',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/coach-registration/coach-registration.module').then( m => m.CoachRegistrationPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'pet-registration',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/pet-registration/pet-registration.module').then( m => m.PetRegistrationPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'make-an-event',
    loadChildren: () => import('./modules/resident_module/pages/resident-upcoming-event/make-an-event/make-an-event.module').then( m => m.MakeAnEventPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'client-register-visitor',
    loadChildren: () => import('./modules/client_app/client-register-visitor/client-register-visitor.module').then( m => m.ClientRegisterVisitorPageModule)
  },
  {
    path: 'search-nric-confirmation',
    loadChildren: () => import('./modules/resident_car_list_module/pages/search-nric-confirmation/search-nric-confirmation.module').then( m => m.SearchNricConfirmationPageModule)
  },
  {
    path: 'my-pets-detail',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-profile/my-profile-my-pets/my-pets-detail/my-pets-detail.module').then( m => m.MyPetsDetailPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'alert-ticket-detail',
    loadChildren: () => import('./modules/alert_module/pages/alert-ticket-detail/alert-ticket-detail.module').then( m => m.AlertTicketDetailPageModule)
  },
  {
    path: 'login-vms',
    loadChildren: () => import('./modules/home_module/pages/login-vms/login-vms.module').then( m => m.LoginVmsPageModule)
  },
  {
    path: 'client-approvals',
    loadChildren: () => import('./modules/client_app/client-approvals/client-approvals.module').then( m => m.ClientApprovalsPageModule)
  },
  {
    path: 'client-approvals-details',
    loadChildren: () => import('./modules/client_app/client-approvals/client-approvals-details/client-approvals-details.module').then( m => m.ClientApprovalsDetailsPageModule)
  },
  {
    path: 'client-raise-ticket',
    loadChildren: () => import('./modules/client_app/client-raise-ticket/client-raise-ticket.module').then( m => m.ClientRaiseTicketPageModule)
  },
  {
    path: 'client-ticket-detail',
    loadChildren: () => import('./modules/client_app/client-raise-ticket/client-ticket-detail/client-ticket-detail.module').then( m => m.ClientTicketDetailPageModule)
  },
  {
    path: 'client-polling',
    loadChildren: () => import('./modules/client_app/client-polling/client-polling.module').then( m => m.ClientPollingPageModule)
  },
  {
    path: 'client-notices',
    loadChildren: () => import('./modules/client_app/client-notices/client-notices.module').then( m => m.ClientNoticesPageModule)
  },
  {
    path: 'client-reports',
    loadChildren: () => import('./modules/client_app/client-reports/client-reports.module').then( m => m.ClientReportsPageModule)
  },
  {
    path: 'client-facility',
    loadChildren: () => import('./modules/client_app/client-facility/client-facility.module').then( m => m.ClientFacilityPageModule)
  },
  {
    path: 'client-facility-detail',
    loadChildren: () => import('./modules/client_app/client-facility/client-facility-detail/client-facility-detail.module').then( m => m.ClientFacilityDetailPageModule)
  },
  {
    path: 'client-facility-booking-detail',
    loadChildren: () => import('./modules/client_app/client-facility/client-facility-booking-detail/client-facility-booking-detail.module').then( m => m.ClientFacilityBookingDetailPageModule)
  },
  {
    path: 'client-house-rules',
    loadChildren: () => import('./modules/client_app/client-house-rules/client-house-rules.module').then( m => m.ClientHouseRulesPageModule)
  },
  {
    path: 'client-quick-dials',
    loadChildren: () => import('./modules/client_app/client-quick-dials/client-quick-dials.module').then( m => m.ClientQuickDialsPageModule)
  },
  {
    path: 'client-upcoming-events',
    loadChildren: () => import('./modules/client_app/client-upcoming-events/client-upcoming-events.module').then( m => m.ClientUpcomingEventsPageModule)
  },
  {
    path: 'contractor-nric-scan',
    loadChildren: () => import('./modules/contractor_module/pages/contractor-nric-scan/contractor-nric-scan.module').then( m => m.ContractorNricScanPageModule)
  },
  {
    path: 'client-blacklist',
    loadChildren: () => import('./modules/client_app/client-blacklist/client-blacklist.module').then( m => m.ClientBlacklistPageModule)
  },
  {
    path: 'client-wheel-clamp',
    loadChildren: () => import('./modules/client_app/client-wheel-clamp/client-wheel-clamp.module').then( m => m.ClientWheelClampPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./modules/resident_module/pages/resident-settings-page/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./modules/resident_module/pages/resident-settings-page/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'client-events-day-view',
    loadChildren: () => import('./modules/client_app/client-upcoming-events/client-events-day-view/client-events-day-view.module').then( m => m.ClientEventsDayViewPageModule)
  },
  {
    path: 'issue-app-detail',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-app-issue/issue-app-detail/issue-app-detail.module').then( m => m.IssueAppDetailPageModule)
  },
  {
    path: 'issue-an-detail',
    loadChildren: () => import('./modules/resident_module/pages/resident-report-an-issue/issue-an-detail/issue-an-detail.module').then( m => m.IssueAnDetailPageModule)
  },
  {
    path: 'client-login',
    loadChildren: () => import('./modules/client_app/client-login/client-login.module').then( m => m.ClientLoginPageModule)
  },
  {
    path: 'client-app-issues',
    loadChildren: () => import('./modules/client_app/client-app-issues/client-app-issues.module').then( m => m.ClientAppIssuesPageModule)
  },
  {
    path: 'client-settings',
    loadChildren: () => import('./modules/client_app/client-settings/client-settings.module').then( m => m.ClientSettingsPageModule)
  },
  {
    path: 'client-change-password',
    loadChildren: () => import('./modules/client_app/client-settings/client-change-password/client-change-password.module').then( m => m.ClientChangePasswordPageModule)
  },
  {
    path: 'client-privacy-policy',
    loadChildren: () => import('./modules/client_app/client-settings/client-privacy-policy/client-privacy-policy.module').then( m => m.ClientPrivacyPolicyPageModule)
  },
  {
    path: 'client-my-profile',
    loadChildren: () => import('./modules/client_app/client-my-profile/client-my-profile.module').then( m => m.ClientMyProfilePageModule)
  },
  {
    path: 'records-contractor',
    loadChildren: () => import('./modules/records_module/pages/records-contractor/records-contractor.module').then( m => m.RecordsContractorPageModule)
  },
  {
    path: 'records-contractor-detail',
    loadChildren: () => import('./modules/records_module/pages/records-contractor/records-contractor-detail/records-contractor-detail.module').then( m => m.RecordsContractorDetailPageModule)
  },
  {
    path: 'client-events-detail',
    loadChildren: () => import('./modules/client_app/client-upcoming-events/client-events-detail/client-events-detail.module').then( m => m.ClientEventsDetailPageModule)
  },
  {
    path: 'client-residents',
    loadChildren: () => import('./modules/client_app/client-residents/client-residents.module').then( m => m.ClientResidentsPageModule)
  },
  {
    path: 'incoming-call',
    loadChildren: () => import('./modules/call_module/incoming-call/incoming-call.module').then( m => m.IncomingCallPageModule)
  },
  {
    path: 'ongoing-call',
    loadChildren: () => import('./modules/call_module/ongoing-call/ongoing-call.module').then( m => m.OngoingCallPageModule)
  },
  {
    path: 'outgoing-call',
    loadChildren: () => import('./modules/call_module/outgoing-call/outgoing-call.module').then( m => m.OutgoingCallPageModule)
  },
  {
    path: 'client-docs',
    loadChildren: () => import('./modules/client_app/client-docs/client-docs.module').then( m => m.ClientDocsPageModule)
  },
  {
    path: 'my-vehicle-payment-form',
    loadChildren: () => import('./modules/resident_module/pages/resident-my-vehicle/my-vehicle-payment-form/my-vehicle-payment-form.module').then( m => m.MyVehiclePaymentFormPageModule)
  },
  {
    path: 'client-payment-settings',
    loadChildren: () => import('./modules/client_app/client-payment-settings/client-payment-settings.module').then( m => m.ClientPaymentSettingsPageModule)
  },
  {
    path: 'client-notification',
    loadChildren: () => import('./modules/client_app/client-notification/client-notification.module').then( m => m.ClientNotificationPageModule)
  },
  {
    path: 'contractor-commercial-form',
    loadChildren: () => import('./modules/contractor_module/pages/contractor-commercial-form/contractor-commercial-form.module').then( m => m.ContractorCommercialFormPageModule)
  },
  // // rewrite code
  {
    path: 'resident-home-page',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-home-page/resident-home-page.module').then( m => m.ResidentHomePagePageModule),
    // canActivate:[authGuard]
  },
  {
    path: 'app-report-main',
    loadChildren: () => import('./modules/resident-user-module/pages/app-report-an-issue/app-report-main/app-report-main.module').then( m => m.AppReportMainPageModule),
    // canActivate:[authGuard]
  },
  {
    path: 'settings-main',
    loadChildren: () => import('./modules/resident-user-module/pages/settings-apps-menus/settings-main/settings-main.module').then( m => m.SettingsMainPageModule),
    // canActivate:[authGuard]
  },
  {
    path: 'info-page-settings',
    loadChildren: () => import('./modules/resident-user-module/pages/settings-apps-menus/info-page-settings/info-page-settings.module').then( m => m.InfoPageSettingsPageModule)
  },
  {
    path: 'visitor-main',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-visitor/visitor-main/visitor-main.module').then( m => m.VisitorMainPageModule),
    // canActivate:[authGuard]
  },
  {
    path: 'visitor-invitig-form',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-visitor/visitor-invitig-form/visitor-invitig-form.module').then( m => m.VisitorInvitigFormPageModule)
  },
  {
    path: 'hired-card-in-visitor',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-visitor/hired-card-in-visitor/hired-card-in-visitor.module').then( m => m.HiredCardInVisitorPageModule)
  },
  {
    path: 'history-in-visitor',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-visitor/history-in-visitor/history-in-visitor.module').then( m => m.HistoryInVisitorPageModule)
  },
  {
    path: 'detail-history-in-visitor',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-visitor/detail-history-in-visitor/detail-history-in-visitor.module').then( m => m.DetailHistoryInVisitorPageModule)
  },
  {
    path: 'visitor-inviting-from-history',
    loadChildren: () => import('./modules/resident-user-module/pages/resident-visitor/visitor-inviting-from-history/visitor-inviting-from-history.module').then( m => m.VisitorInvitingFromHistoryPageModule)
  },
  {
    path: 'contractor-commercial-main',
    loadChildren: () => import('./modules/resident-user-module/pages/contractor-commercial/contractor-commercial-main/contractor-commercial-main.module').then( m => m.ContractorCommercialMainPageModule)
  },
  {
    path: 'contractor-inviting-form',
    loadChildren: () => import('./modules/resident-user-module/pages/contractor-commercial/contractor-inviting-form/contractor-inviting-form.module').then( m => m.ContractorInvitingFormPageModule)
  },
  {
    path: 'contractor-inviting-from-history',
    loadChildren: () => import('./modules/resident-user-module/pages/contractor-commercial/contractor-inviting-from-history/contractor-inviting-from-history.module').then( m => m.ContractorInvitingFromHistoryPageModule)
  },
  {
    path: 'detail-history-in-commercial',
    loadChildren: () => import('./modules/resident-user-module/pages/contractor-commercial/detail-history-in-commercial/detail-history-in-commercial.module').then( m => m.DetailHistoryInCommercialPageModule)
  },
  {
    path: 'history-in-contractor',
    loadChildren: () => import('./modules/resident-user-module/pages/contractor-commercial/history-in-contractor/history-in-contractor.module').then( m => m.HistoryInContractorPageModule)
  },
  {
    path: 'door-access-main',
    loadChildren: () => import('./modules/resident-user-module/pages/door-access-page/door-access-main/door-access-main.module').then( m => m.DoorAccessMainPageModule)
  },
  {
    path: 'facility-booking-main',
    loadChildren: () => import('./modules/resident-user-module/pages/facility-booking-page/facility-booking-main/facility-booking-main.module').then( m => m.FacilityBookingMainPageModule)
  },
  {
    path: 'family-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/family-page/family-main/family-main.module').then( m => m.FamilyMainPageModule)
  },
  {
    path: 'find-a-service-provider-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/find-a-service-provider-page/service-provider-main/service-provider-main.module').then( m => m.ServiceProviderMainPageModule)
  },
  {
    path: 'my-vehicle-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/my-vehicle-page/my-vehicle-main/my-vehicle-main.module').then( m => m.MyVehicleMainPageModule)
  },
  {
    path: 'notice-and-docs-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/notice-and-docs-page/notice-and-docs-main/notice-and-docs-main.module').then( m => m.NoticeAndDocsMainPageModule)
  },
  {
    path: 'notification-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/notification-page/notification-main/notification-main.module').then( m => m.NotificationMainPageModule)
  },
  {
    path: 'payment-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/payments-page/payments-main/payments-main.module').then( m => m.PaymentsMainPageModule)
  },
  {
    path: 'polling-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/polling-page/polling-main/polling-main.module').then( m => m.PollingMainPageModule)
  },
  {
    path: 'profile-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/profile-page/profile-main/profile-main.module').then( m => m.ProfileMainPageModule)
  },
  {
    path: 'quick-dial-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/quick-dial-page/quick-dials-main/quick-dials-main.module').then( m => m.QuickDialsMainPageModule)
  },
  {
    path: 'raise-a-request-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/raise-a-request-main/raise-a-request-main.module').then( m => m.RaiseARequestMainPageModule)
  },
  {
    path: 'upcoming-event-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/upcoming-event-page/upcoming-event-main/upcoming-event-main.module').then( m => m.UpcomingEventMainPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
