import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientFacilityPageRoutingModule } from './client-facility-routing.module';

import { ClientFacilityPage } from './client-facility.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientFacilityPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientFacilityPage]
})
export class ClientFacilityPageModule {}
