import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestAccessCardPageRoutingModule } from './form-for-request-access-card-routing.module';

import { FormForRequestAccessCardPage } from './form-for-request-access-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestAccessCardPageRoutingModule
  ],
  declarations: [FormForRequestAccessCardPage]
})
export class FormForRequestAccessCardPageModule {}
