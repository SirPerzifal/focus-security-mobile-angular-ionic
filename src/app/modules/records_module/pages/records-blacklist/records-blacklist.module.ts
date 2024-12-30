import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsBlacklistPageRoutingModule } from './records-blacklist-routing.module';

import { RecordsBlacklistPage } from './records-blacklist.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsBlacklistPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsBlacklistPage]
})
export class RecordsBlacklistPageModule {}
