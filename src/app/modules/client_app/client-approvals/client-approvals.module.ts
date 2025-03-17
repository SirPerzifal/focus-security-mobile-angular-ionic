import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientApprovalsPageRoutingModule } from './client-approvals-routing.module';

import { ClientApprovalsPage } from './client-approvals.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientApprovalsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientApprovalsPage]
})
export class ClientApprovalsPageModule {}
