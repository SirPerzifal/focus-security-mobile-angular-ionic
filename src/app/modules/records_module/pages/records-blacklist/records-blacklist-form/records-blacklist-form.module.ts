import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsBlacklistFormPageRoutingModule } from './records-blacklist-form-routing.module';

import { RecordsBlacklistFormPage } from './records-blacklist-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsBlacklistFormPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsBlacklistFormPage]
})
export class RecordsBlacklistFormPageModule {}
