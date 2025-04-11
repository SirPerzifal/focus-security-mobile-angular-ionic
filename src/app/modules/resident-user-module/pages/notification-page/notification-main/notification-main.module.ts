import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationMainPageRoutingModule } from './notification-main-routing.module';

import { NotificationMainPage } from './notification-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationMainPageRoutingModule,
    SharedModule
  ],
  declarations: [NotificationMainPage]
})
export class NotificationMainPageModule {}
