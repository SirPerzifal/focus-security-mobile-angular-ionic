import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessCardApplicationPageRoutingModule } from './access-card-application-routing.module';

import { AccessCardApplicationPage } from './access-card-application.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessCardApplicationPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [AccessCardApplicationPage]
})
export class AccessCardApplicationPageModule {}
