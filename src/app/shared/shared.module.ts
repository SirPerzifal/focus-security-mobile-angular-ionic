import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { BottomNavBarComponent } from './components/bottom-nav-bar/bottom-nav-bar.component';
import { MultiLineButtonComponent } from './components/multi-line-button/multi-line-button.component';

@NgModule({
  declarations: [
    ButtonIconComponent,
    BottomNavBarComponent,
    MultiLineButtonComponent
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
    MultiLineButtonComponent
  ]
})
export class SharedModule { }