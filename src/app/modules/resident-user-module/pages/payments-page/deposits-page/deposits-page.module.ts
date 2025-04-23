import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepositsPagePageRoutingModule } from './deposits-page-routing.module';

import { DepositsPagePage } from './deposits-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepositsPagePageRoutingModule,
    SharedModule,
  ],
  declarations: [DepositsPagePage]
})
export class DepositsPagePageModule {}
