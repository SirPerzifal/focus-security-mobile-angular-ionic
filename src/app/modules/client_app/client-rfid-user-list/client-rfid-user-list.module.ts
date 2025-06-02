import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientRfidUserListPageRoutingModule } from './client-rfid-user-list-routing.module';

import { ClientRfidUserListPage } from './client-rfid-user-list.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientRfidUserListPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ClientRfidUserListPage]
})
export class ClientRfidUserListPageModule {}
