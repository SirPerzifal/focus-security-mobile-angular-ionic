import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertModalPageRoutingModule } from './alert-modal-routing.module';

import { AlertModalPage } from './alert-modal.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertModalPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [AlertModalPage]
})
export class AlertModalPageModule {}
