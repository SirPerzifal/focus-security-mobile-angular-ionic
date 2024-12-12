import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertMainPageRoutingModule } from './alert-main-routing.module';

import { AlertMainPage } from './alert-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertMainPageRoutingModule
  ],
  declarations: [AlertMainPage]
})
export class AlertMainPageModule {}
