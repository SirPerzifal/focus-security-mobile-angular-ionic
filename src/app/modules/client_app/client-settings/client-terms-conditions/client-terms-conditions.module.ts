import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientTermsConditionsPageRoutingModule } from './client-terms-conditions-routing.module';
import { ClientTermsConditionsPage } from './client-terms-conditions.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientTermsConditionsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientTermsConditionsPage]
})
export class ClientTermsConditionsPageModule {}
