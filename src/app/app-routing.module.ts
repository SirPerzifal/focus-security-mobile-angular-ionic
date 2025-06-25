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
    path: 'records-residents',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents.module').then( m => m.RecordsResidentsPageModule)
  },
  {
    path: 'records-residents-detail',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents-detail/records-residents-detail.module').then( m => m.RecordsResidentsDetailPageModule)
  },
  {
    path: 'client-main-app',
    loadChildren: () => import('./modules/client_app/client-main-app/client-main-app.module').then( m => m.ClientMainAppPageModule),
    canActivate:[authGuard]
  },
  {
    path: 'records-residents-modal',
    loadChildren: () => import('./modules/records_module/pages/records-residents/records-residents-modal/records-residents-modal.module').then( m => m.RecordsResidentsModalPageModule)
  },
  {
    path: 'alert-modal',
    loadChildren: () => import('./modules/alert_module/pages/alert-modal/alert-modal.module').then( m => m.AlertModalPageModule)
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
    path: 'client-events-day-view',
    loadChildren: () => import('./modules/client_app/client-upcoming-events/client-events-day-view/client-events-day-view.module').then( m => m.ClientEventsDayViewPageModule)
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
    path: 'client-payment-settings',
    loadChildren: () => import('./modules/client_app/client-payment-settings/client-payment-settings.module').then( m => m.ClientPaymentSettingsPageModule)
  },
  {
    path: 'client-notification',
    loadChildren: () => import('./modules/client_app/client-notification/client-notification.module').then( m => m.ClientNotificationPageModule)
  },
  {
    path: 'client-employees',
    loadChildren: () => import('./modules/client_app/client-employees/client-employees.module').then( m => m.ClientEmployeesPageModule)
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
    path: 'condo-report-main',
    loadChildren: () => import('./modules/resident-user-module/pages/app-report-an-issue/app-report-main/app-report-main.module').then( m => m.AppReportMainPageModule),
    // canActivate:[authGuard]
  },
  {
    path: 'settings-main',
    loadChildren: () => import('./modules/resident-user-module/pages/settings-apps-menus/settings-main/settings-main.module').then( m => m.SettingsMainPageModule),
    canActivate:[authGuard]
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
    path: 'raise-a-request-page',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/raise-a-request-main/raise-a-request-main.module').then( m => m.RaiseARequestMainPageModule)
  },
  //  {
  //   path: 'raise-a-request-page-main',
  //   loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/resident-raise-a-request.module').then( m => m.ResidentRaiseARequestPageModule)
  // },
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
    path: 'overnight-form-rar',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/overnight-form-rar/overnight-form-rar.module').then( m => m.OvernightFormRarPageModule),
    canActivate:[authGuard]
  },
    {
    path: 'move-in-out-permit',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/move-in-out-permit/move-in-out-permit.module').then( m => m.MoveInOutPermitPageModule),
    canActivate:[authGuard]
  },
    {
    path: 'renovation-permit',
    loadChildren: () => import('./modules/resident_module/pages/resident-raise-a-request/renovation-permit/renovation-permit.module').then( m => m.RenovationPermitPageModule),
    canActivate:[authGuard]
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
    path: 'upcoming-event-page-main',
    loadChildren: () => import('./modules/resident-user-module/pages/upcoming-event-page/upcoming-event-main/upcoming-event-main.module').then( m => m.UpcomingEventMainPageModule)
  },
  {
    path: 'issue-app-detail-new',
    loadChildren: () => import('./modules/resident-user-module/pages/app-report-an-issue/issue-app-detail/issue-app-detail.module').then( m => m.IssueAppDetailPageModule)
  },
  {
    path: 'vms-checkout',
    loadChildren: () => import('./modules/vms-checkout/vms-checkout.module').then( m => m.VmsCheckoutPageModule)
  },
  {
    path: 'history-of-event',
    loadChildren: () => import('./modules/resident-user-module/pages/upcoming-event-page/history-of-event/history-of-event.module').then( m => m.HistoryOfEventPageModule)
  },
  {
    path: 'make-a-new-event',
    loadChildren: () => import('./modules/resident-user-module/pages/upcoming-event-page/make-a-new-event/make-a-new-event.module').then( m => m.MakeANewEventPageModule)
  },
  {
    path: 'place-facility-booking',
    loadChildren: () => import('./modules/resident-user-module/pages/facility-booking-page/place-facility-booking/place-facility-booking.module').then( m => m.PlaceFacilityBookingPageModule)
  },
  {
    path: 'facility-process-to-payment',
    loadChildren: () => import('./modules/resident-user-module/pages/facility-booking-page/facility-process-to-payment/facility-process-to-payment.module').then( m => m.FacilityProcessToPaymentPageModule)
  },
  {
    path: 'facility-booking-see-detail',
    loadChildren: () => import('./modules/resident-user-module/pages/facility-booking-page/facility-booking-see-detail/facility-booking-see-detail.module').then( m => m.FacilityBookingSeeDetailPageModule)
  },
  {
    path: 'pets-detail-for-profile',
    loadChildren: () => import('./modules/resident-user-module/pages/profile-page/pets-detail-for-profile/pets-detail-for-profile.module').then( m => m.PetsDetailForProfilePageModule)
  },
  {
    path: 'bills-and-fines-page',
    loadChildren: () => import('./modules/resident-user-module/pages/payments-page/bills-and-fines-page/bills-and-fines-page.module').then( m => m.BillsAndFinesPagePageModule)
  },
  {
    path: 'deposits-page',
    loadChildren: () => import('./modules/resident-user-module/pages/payments-page/deposits-page/deposits-page.module').then( m => m.DepositsPagePageModule)
  },
  {
    path: 'family-form',
    loadChildren: () => import('./modules/resident-user-module/pages/family-page/family-form/family-form.module').then( m => m.FamilyFormPageModule)
  },
  {
    path: 'vehicle-form',
    loadChildren: () => import('./modules/resident-user-module/pages/my-vehicle-page/vehicle-form/vehicle-form.module').then( m => m.VehicleFormPageModule)
  },
  {
    path: 'tenant-extend-page',
    loadChildren: () => import('./modules/resident-user-module/pages/family-page/tenant-extend-page/tenant-extend-page.module').then( m => m.TenantExtendPagePageModule)
  },
  {
    path: 'payment-form-vehicle',
    loadChildren: () => import('./modules/resident-user-module/pages/my-vehicle-page/payment-form-vehicle/payment-form-vehicle.module').then( m => m.PaymentFormVehiclePageModule)
  },
  {
    path: 'records-alert-next',
    loadChildren: () => import('./modules/records_module/pages/records-wheel-clamped/records-alert-next/records-alert-next.module').then( m => m.RecordsAlertNextPageModule)
  },
  {
    path: 'form-for-request-access-card',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-request-access-card/form-for-request-access-card.module').then( m => m.FormForRequestAccessCardPageModule)
  },
  {
    path: 'form-and-history-appeal-parking-fines',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-and-history-appeal-parking-fines/form-and-history-appeal-parking-fines.module').then( m => m.FormAndHistoryAppealParkingFinesPageModule)
  },
  {
    path: 'form-for-request-bibycle-tag-application',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-request-bibycle-tag-application/form-for-request-bibycle-tag-application.module').then( m => m.FormForRequestBibycleTagApplicationPageModule)
  },
  {
    path: 'form-for-coach-registration',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-coach-registration/form-for-coach-registration.module').then( m => m.FormForCoachRegistrationPageModule)
  },
  {
    path: 'form-for-request-move-in-out-permit',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-request-move-in-out-permit/form-for-request-move-in-out-permit.module').then( m => m.FormForRequestMoveInOutPermitPageModule)
  },
  {
    path: 'form-for-request-overnight-parking',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-request-overnight-parking/form-for-request-overnight-parking.module').then( m => m.FormForRequestOvernightParkingPageModule)
  },
  {
    path: 'form-for-registration-pet',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-registration-pet/form-for-registration-pet.module').then( m => m.FormForRegistrationPetPageModule)
  },
  {
    path: 'form-for-request-registration-permit',
    loadChildren: () => import('./modules/resident-user-module/pages/raise-a-request-page/form-for-request-registration-permit/form-for-request-registration-permit.module').then( m => m.FormForRequestRegistrationPermitPageModule)
  },
  {
    path: 'client-rfid-user-list',
    loadChildren: () => import('./modules/client_app/client-rfid-user-list/client-rfid-user-list.module').then( m => m.ClientRfidUserListPageModule)
  },
  {
    path: 'employee-main',
    loadChildren: () => import('./modules/employee_app/employee-main/employee-main.module').then( m => m.EmployeeMainPageModule)
  },
  {
    path: 'employee-schedule',
    loadChildren: () => import('./modules/employee_app/employee-schedule/employee-schedule.module').then( m => m.EmployeeSchedulePageModule)
  },
  {
    path: 'employee-leave-application',
    loadChildren: () => import('./modules/employee_app/employee-leave-application/employee-leave-application.module').then( m => m.EmployeeLeaveApplicationPageModule)
  },
  {
    path: 'unregistered-simulation-module',
    loadChildren: () => import('./modules/vms_app/unregistered-simulation-module/unregistered-simulation-module.module').then( m => m.UnregisteredSimulationModulePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
