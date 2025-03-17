import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueAnDetailPageRoutingModule } from './issue-an-detail-routing.module';

import { IssueAnDetailPage } from './issue-an-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueAnDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [IssueAnDetailPage]
})
export class IssueAnDetailPageModule {}
