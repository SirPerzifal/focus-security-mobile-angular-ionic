import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsMainPageRoutingModule } from './payments-main-routing.module';

import { PaymentsMainPage } from './payments-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsMainPageRoutingModule
  ],
  declarations: [PaymentsMainPage]
})
export class PaymentsMainPageModule {}
