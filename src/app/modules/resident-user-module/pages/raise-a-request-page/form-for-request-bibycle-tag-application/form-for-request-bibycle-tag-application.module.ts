import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestBibycleTagApplicationPageRoutingModule } from './form-for-request-bibycle-tag-application-routing.module';

import { FormForRequestBibycleTagApplicationPage } from './form-for-request-bibycle-tag-application.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestBibycleTagApplicationPageRoutingModule,
    SharedModule
  ],
  declarations: [FormForRequestBibycleTagApplicationPage]
})
export class FormForRequestBibycleTagApplicationPageModule {}
