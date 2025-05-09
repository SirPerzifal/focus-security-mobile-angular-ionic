import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaiseARequestMainPageRoutingModule } from './raise-a-request-main-routing.module';

import { RaiseARequestMainPage } from './raise-a-request-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaiseARequestMainPageRoutingModule,
    SharedModule
  ],
  declarations: [RaiseARequestMainPage]
})
export class RaiseARequestMainPageModule {}
