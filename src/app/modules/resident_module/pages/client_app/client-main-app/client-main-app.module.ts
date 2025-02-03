import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientMainAppPageRoutingModule } from './client-main-app-routing.module';

import { ClientMainAppPage } from './client-main-app.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientMainAppPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ClientMainAppPage]
})
export class ClientMainAppPageModule {}
