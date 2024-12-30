import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsVisitorPageRoutingModule } from './records-visitor-routing.module';

import { RecordsVisitorPage } from './records-visitor.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsVisitorPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsVisitorPage]
})
export class RecordsVisitorPageModule {}
