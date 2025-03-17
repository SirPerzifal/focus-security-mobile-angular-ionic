import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientBlacklistPageRoutingModule } from './client-blacklist-routing.module';

import { ClientBlacklistPage } from './client-blacklist.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientBlacklistPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientBlacklistPage]
})
export class ClientBlacklistPageModule {}
