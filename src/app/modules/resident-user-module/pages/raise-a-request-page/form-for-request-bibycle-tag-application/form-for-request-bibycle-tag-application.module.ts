import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestBibycleTagApplicationPageRoutingModule } from './form-for-request-bibycle-tag-application-routing.module';

import { FormForRequestBibycleTagApplicationPage } from './form-for-request-bibycle-tag-application.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestBibycleTagApplicationPageRoutingModule
  ],
  declarations: [FormForRequestBibycleTagApplicationPage]
})
export class FormForRequestBibycleTagApplicationPageModule {}
