import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityBookingSeeDetailPageRoutingModule } from './facility-booking-see-detail-routing.module';

import { FacilityBookingSeeDetailPage } from './facility-booking-see-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityBookingSeeDetailPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FacilityBookingSeeDetailPage]
})
export class FacilityBookingSeeDetailPageModule {}
