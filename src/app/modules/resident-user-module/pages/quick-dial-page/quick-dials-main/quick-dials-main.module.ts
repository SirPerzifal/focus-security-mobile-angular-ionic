import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickDialsMainPageRoutingModule } from './quick-dials-main-routing.module';

import { QuickDialsMainPage } from './quick-dials-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuickDialsMainPageRoutingModule
  ],
  declarations: [QuickDialsMainPage]
})
export class QuickDialsMainPageModule {}
