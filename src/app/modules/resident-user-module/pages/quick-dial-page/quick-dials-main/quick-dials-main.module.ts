import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickDialsMainPageRoutingModule } from './quick-dials-main-routing.module';

import { QuickDialsMainPage } from './quick-dials-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuickDialsMainPageRoutingModule,
    SharedModule
  ],
  declarations: [QuickDialsMainPage]
})
export class QuickDialsMainPageModule {}
