import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstateModalPageRoutingModule } from './estate-modal-routing.module';

import { EstateModalPage } from './estate-modal.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstateModalPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [EstateModalPage]
})
export class EstateModalPageModule {}
