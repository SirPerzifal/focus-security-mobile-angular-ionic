import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaiseARequestMainPageRoutingModule } from './raise-a-request-main-routing.module';

import { RaiseARequestMainPage } from './raise-a-request-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaiseARequestMainPageRoutingModule
  ],
  declarations: [RaiseARequestMainPage]
})
export class RaiseARequestMainPageModule {}
