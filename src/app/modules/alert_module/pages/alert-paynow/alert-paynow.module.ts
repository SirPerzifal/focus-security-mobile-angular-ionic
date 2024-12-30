import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertPaynowPageRoutingModule } from './alert-paynow-routing.module';

import { AlertPaynowPage } from './alert-paynow.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertPaynowPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [AlertPaynowPage]
})
export class AlertPaynowPageModule {}
