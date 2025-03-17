import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientApprovalsDetailsPageRoutingModule } from './client-approvals-details-routing.module';

import { ClientApprovalsDetailsPage } from './client-approvals-details.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientApprovalsDetailsPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientApprovalsDetailsPage]
})
export class ClientApprovalsDetailsPageModule {}
