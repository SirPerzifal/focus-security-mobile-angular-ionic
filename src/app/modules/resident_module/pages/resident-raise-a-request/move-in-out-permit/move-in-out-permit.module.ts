import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoveInOutPermitPageRoutingModule } from './move-in-out-permit-routing.module';

import { MoveInOutPermitPage } from './move-in-out-permit.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoveInOutPermitPageRoutingModule,
    ComponentsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [MoveInOutPermitPage]
})
export class MoveInOutPermitPageModule {}
