import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillsAndFinesPagePageRoutingModule } from './bills-and-fines-page-routing.module';

import { BillsAndFinesPagePage } from './bills-and-fines-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillsAndFinesPagePageRoutingModule,
    SharedModule
  ],
  declarations: [BillsAndFinesPagePage]
})
export class BillsAndFinesPagePageModule {}
