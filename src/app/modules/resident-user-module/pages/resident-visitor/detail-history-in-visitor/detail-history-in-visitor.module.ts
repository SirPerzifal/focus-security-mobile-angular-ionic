import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailHistoryInVisitorPageRoutingModule } from './detail-history-in-visitor-routing.module';

import { DetailHistoryInVisitorPage } from './detail-history-in-visitor.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailHistoryInVisitorPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [DetailHistoryInVisitorPage]
})
export class DetailHistoryInVisitorPageModule {}
