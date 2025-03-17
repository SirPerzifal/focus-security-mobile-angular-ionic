import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientAppIssuesPageRoutingModule } from './client-app-issues-routing.module';

import { ClientAppIssuesPage } from './client-app-issues.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientAppIssuesPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientAppIssuesPage]
})
export class ClientAppIssuesPageModule {}
