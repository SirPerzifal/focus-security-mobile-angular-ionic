import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientFacilityDetailPageRoutingModule } from './client-facility-detail-routing.module';

import { ClientFacilityDetailPage } from './client-facility-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientFacilityDetailPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientFacilityDetailPage]
})
export class ClientFacilityDetailPageModule {}
