import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationMainPageRoutingModule } from './notification-main-routing.module';

import { NotificationMainPage } from './notification-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationMainPageRoutingModule
  ],
  declarations: [NotificationMainPage]
})
export class NotificationMainPageModule {}
