import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaiseRequestFormPagePageRoutingModule } from './raise-request-form-page-routing.module';

import { RaiseRequestFormPagePage } from './raise-request-form-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaiseRequestFormPagePageRoutingModule,
    SharedModule
  ],
  declarations: [RaiseRequestFormPagePage]
})
export class RaiseRequestFormPagePageModule {}
