import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientNoticesPageRoutingModule } from './client-notices-routing.module';

import { ClientNoticesPage } from './client-notices.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientNoticesPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientNoticesPage]
})
export class ClientNoticesPageModule {}
