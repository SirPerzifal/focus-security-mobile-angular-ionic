import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenovationPermitPageRoutingModule } from './renovation-permit-routing.module';

import { RenovationPermitPage } from './renovation-permit.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenovationPermitPageRoutingModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [RenovationPermitPage]
})
export class RenovationPermitPageModule {}
