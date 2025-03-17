import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientRaiseTicketPageRoutingModule } from './client-raise-ticket-routing.module';

import { ClientRaiseTicketPage } from './client-raise-ticket.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientRaiseTicketPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientRaiseTicketPage]
})
export class ClientRaiseTicketPageModule {}
