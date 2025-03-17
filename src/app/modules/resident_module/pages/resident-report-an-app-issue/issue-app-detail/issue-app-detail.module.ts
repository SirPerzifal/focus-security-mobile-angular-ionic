import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueAppDetailPageRoutingModule } from './issue-app-detail-routing.module';

import { IssueAppDetailPage } from './issue-app-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueAppDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [IssueAppDetailPage]
})
export class IssueAppDetailPageModule {}
