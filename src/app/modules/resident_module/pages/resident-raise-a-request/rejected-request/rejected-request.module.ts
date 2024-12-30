import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RejectedRequestPageRoutingModule } from './rejected-request-routing.module';

import { RejectedRequestPage } from './rejected-request.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RejectedRequestPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [RejectedRequestPage]
})
export class RejectedRequestPageModule {}
