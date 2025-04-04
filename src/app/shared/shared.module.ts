import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { BottomNavBarComponent } from './components/bottom-nav-bar/bottom-nav-bar.component';
import { MultiLineButtonComponent } from './components/multi-line-button/multi-line-button.component';
import { CheckboxConfirmationComponent } from './components/checkbox-confirmation/checkbox-confirmation.component';
import { VotingGraphComponent } from './components/voting-graph/voting-graph.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ModalPaymentCustomComponent } from './resident-components/modal-payment-custom/modal-payment-custom.component';
import { TermsConditionModalComponent } from './resident-components/terms-condition-modal/terms-condition-modal.component';

// rewrite
import { HeaderComponent } from './resident-components/header/header.component';
import { LongButtonComponent } from './resident-components/long-button/long-button.component';
import { SquareButtonComponent } from './resident-components/square-button/square-button.component';
import { BottonNavBarComponent } from './resident-components/botton-nav-bar/botton-nav-bar.component';
import { ModalEstateHomepageComponent } from './resident-components/modal-estate-homepage/modal-estate-homepage.component';
import { HeaderInnerPageComponent } from './resident-components/header-inner-page/header-inner-page.component';
import { NavTabsComponent } from './resident-components/nav-tabs/nav-tabs.component';
import { InputComponentComponent } from './resident-components/input-component/input-component.component';
import { ModalChoosePaymentMethodComponent } from './resident-components/modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalPaymentManualCustomComponent } from './resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';

@NgModule({
  declarations: [
    ButtonIconComponent,
    BottomNavBarComponent,
    MultiLineButtonComponent,
    CheckboxConfirmationComponent,
    VotingGraphComponent,
    CalendarComponent,
    ModalPaymentCustomComponent,
    TermsConditionModalComponent,
    //rewrite
    HeaderComponent,
    LongButtonComponent,
    SquareButtonComponent,
    BottonNavBarComponent,
    ModalEstateHomepageComponent,
    HeaderInnerPageComponent,
    NavTabsComponent,
    InputComponentComponent,
    ModalChoosePaymentMethodComponent,
    ModalPaymentManualCustomComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule
  ],
  exports: [
    ButtonIconComponent,
    FontAwesomeModule,
    BottomNavBarComponent,
    MultiLineButtonComponent,
    CheckboxConfirmationComponent,
    VotingGraphComponent,
    CalendarComponent,
    ModalPaymentCustomComponent,
    TermsConditionModalComponent,
    //rewrite
    HeaderComponent,
    LongButtonComponent,
    SquareButtonComponent,
    BottonNavBarComponent,
    ModalEstateHomepageComponent,
    HeaderInnerPageComponent,
    NavTabsComponent,
    InputComponentComponent,
    ModalChoosePaymentMethodComponent,
    ModalPaymentManualCustomComponent
  ]
})
export class SharedModule { }