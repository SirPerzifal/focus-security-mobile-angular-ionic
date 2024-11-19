import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillsFinesPageRoutingModule } from './bills-fines-routing.module';

import { BillsFinesPage } from './bills-fines.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillsFinesPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [BillsFinesPage]
})
export class BillsFinesPageModule {}
