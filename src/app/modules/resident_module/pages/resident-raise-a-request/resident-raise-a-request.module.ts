import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentRaiseARequestPageRoutingModule } from './resident-raise-a-request-routing.module';

import { ResidentRaiseARequestPage } from './resident-raise-a-request.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentRaiseARequestPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentRaiseARequestPage]
})
export class ResidentRaiseARequestPageModule {}
