import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestAccessCardPageRoutingModule } from './form-for-request-access-card-routing.module';

import { FormForRequestAccessCardPage } from './form-for-request-access-card.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestAccessCardPageRoutingModule,
    SharedModule
  ],
  declarations: [FormForRequestAccessCardPage]
})
export class FormForRequestAccessCardPageModule {}
