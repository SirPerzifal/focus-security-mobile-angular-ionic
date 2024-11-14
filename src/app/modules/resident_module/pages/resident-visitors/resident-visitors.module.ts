import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentVisitorsPageRoutingModule } from './resident-visitors-routing.module';

import { ResidentVisitorsPage } from './resident-visitors.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentVisitorsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [
    ResidentVisitorsPage
  ]
})
export class ResidentVisitorsPageModule {}
