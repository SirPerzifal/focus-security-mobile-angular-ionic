import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { BottomNavBarComponent } from './components/bottom-nav-bar/bottom-nav-bar.component';
import { MultiLineButtonComponent } from './components/multi-line-button/multi-line-button.component';
import { CheckboxConfirmationComponent } from './components/checkbox-confirmation/checkbox-confirmation.component';
import { VotingGraphComponent } from './components/voting-graph/voting-graph.component';

@NgModule({
  declarations: [
    ButtonIconComponent,
    BottomNavBarComponent,
    MultiLineButtonComponent,
    CheckboxConfirmationComponent,
    VotingGraphComponent
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
    VotingGraphComponent
  ]
})
export class SharedModule { }