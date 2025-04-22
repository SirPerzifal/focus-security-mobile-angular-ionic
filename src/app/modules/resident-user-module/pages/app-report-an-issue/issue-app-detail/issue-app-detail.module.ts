import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueAppDetailPageRoutingModule } from './issue-app-detail-routing.module';

import { IssueAppDetailPage } from './issue-app-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    IssueAppDetailPageRoutingModule
  ],
  declarations: [IssueAppDetailPage]
})
export class IssueAppDetailPageModule {}
