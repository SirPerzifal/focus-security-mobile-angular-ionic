import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsMainPageRoutingModule } from './records-main-routing.module';

import { RecordsMainPage } from './records-main.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsMainPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsMainPage]
})
export class RecordsMainPageModule {}
